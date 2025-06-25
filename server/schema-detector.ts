import { harborPool } from './db.js';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface TableSchema {
  [columnName: string]: {
    type: string;
    nullable: boolean;
  };
}

interface DatabaseSchema {
  harbor_crossing_times: TableSchema;
  harbor_tide_times: TableSchema;
  harbor_weather_data: TableSchema;
}

let cachedSchema: DatabaseSchema | null = null;

export async function detectDatabaseSchema(): Promise<DatabaseSchema> {
  if (cachedSchema) {
    return cachedSchema;
  }

  const client = await harborPool.connect();
  
  try {
    const tables = ['harbor_crossing_times', 'harbor_tide_times', 'harbor_weather_data'];
    const schema: DatabaseSchema = {} as DatabaseSchema;

    for (const tableName of tables) {
      const result = await client.query<ColumnInfo>(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);

      const tableSchema: TableSchema = {};
      for (const row of result.rows) {
        tableSchema[row.column_name] = {
          type: row.data_type,
          nullable: row.is_nullable === 'YES'
        };
      }
      
      schema[tableName as keyof DatabaseSchema] = tableSchema;
    }

    cachedSchema = schema;
    console.log('Detected database schema:', JSON.stringify(schema, null, 2));
    return schema;
    
  } finally {
    client.release();
  }
}

export async function getTableColumns(tableName: string): Promise<string[]> {
  const schema = await detectDatabaseSchema();
  return Object.keys(schema[tableName as keyof DatabaseSchema] || {});
}

export function buildSelectQuery(tableName: string, columns: string[]): string {
  const columnList = columns.length > 0 ? columns.join(', ') : '*';
  return `SELECT ${columnList} FROM ${tableName}`;
}