import { harborPool } from './db.js';

// Dynamic storage that adapts to any database schema
export class DynamicStorage {
  private tableSchemas: Map<string, string[]> = new Map();

  async getTableColumns(tableName: string): Promise<string[]> {
    if (this.tableSchemas.has(tableName)) {
      return this.tableSchemas.get(tableName)!;
    }

    const client = await harborPool.connect();
    try {
      const result = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      const columns = result.rows.map(row => row.column_name);
      this.tableSchemas.set(tableName, columns);
      console.log(`Detected columns for ${tableName}:`, columns);
      return columns;
    } finally {
      client.release();
    }
  }

  async queryTable(tableName: string, whereClause: string = '', params: any[] = []): Promise<any[]> {
    const client = await harborPool.connect();
    try {
      const sql = `SELECT * FROM ${tableName} ${whereClause} ORDER BY date`;
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  mapRowToStandardFormat(row: any, type: 'crossing' | 'tide' | 'weather'): any {
    const base = {
      id: row.id,
      date: row.date,
      createdAt: row.created_at || null
    };

    switch (type) {
      case 'crossing':
        return {
          ...base,
          morning: row.morning || row.safe_from_1 || null,
          midday: row.midday || row.unsafe_from_1 || null,
          evening: row.evening || row.safe_from_2 || null,
          night: row.night || null,
          safeFrom1: row.safe_from_1 || row.morning || null,
          safeTo1: row.safe_to_1 || null,
          safeFrom2: row.safe_from_2 || row.evening || null,
          safeTo2: row.safe_to_2 || null,
          unsafeFrom1: row.unsafe_from_1 || row.midday || null,
          unsafeTo1: row.unsafe_to_1 || null,
          unsafeFrom2: row.unsafe_from_2 || null,
          unsafeTo2: row.unsafe_to_2 || null,
          status: row.status || 'active',
          notes: row.notes || null
        };

      case 'tide':
        return {
          ...base,
          highTide1: row.high_tide_1 || null,
          lowTide1: row.low_tide_1 || null,
          highTide2: row.high_tide_2 || null,
          lowTide2: row.low_tide_2 || null,
          highTide1Time: row.high_tide_1_time || row.high_tide_1 || null,
          highTide1Height: row.high_tide_1_height || null,
          lowTide1Time: row.low_tide_1_time || row.low_tide_1 || null,
          lowTide1Height: row.low_tide_1_height || null,
          highTide2Time: row.high_tide_2_time || row.high_tide_2 || null,
          highTide2Height: row.high_tide_2_height || null,
          lowTide2Time: row.low_tide_2_time || row.low_tide_2 || null,
          lowTide2Height: row.low_tide_2_height || null
        };

      case 'weather':
        return {
          ...base,
          temperature: row.temperature || null,
          windSpeed: row.wind_speed || null,
          precipitation: row.precipitation || null,
          visibility: row.visibility || null,
          condition: row.condition || null,
          description: row.description || null,
          humidity: row.humidity || null,
          windDirection: row.wind_direction || null,
          temperatureMin: row.temperature_min || null,
          temperatureMax: row.temperature_max || null,
          precipitationSum: row.precipitation_sum || null,
          windSpeedMax: row.wind_speed_max || null,
          windDirectionDominant: row.wind_direction_dominant || null,
          uvIndexMax: row.uv_index_max || null,
          uvIndex: row.uv_index || null,
          source: row.source || null,
          cloudcover: row.cloudcover || null
        };

      default:
        return { ...base, ...row };
    }
  }
}

export const dynamicStorage = new DynamicStorage();