import { 
  crossingTimes,
  tideData,
  weatherData,
  userPreferences,
  appSettings,
  type CrossingTime,
  type TideData,
  type WeatherData,
  type UserPreferences,
  type AppSettings,
  type InsertUserPreferences,
  type InsertAppSettings
} from "@shared/schema";
import { harborDb, harborPool } from "./db";
import { gte, lte, and } from "drizzle-orm";

// Import date utils directly since we can't import from client
function getWeekRange(weekOffset: number) {
  const today = new Date();
  const daysToMonday = (today.getDay() + 6) % 7; // 0 for Monday, 1 for Tuesday, etc.
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { startDate: monday, endDate: sunday };
}

export interface IStorage {
  // Harbor data (read-only from external database)
  getCrossingTimesForWeek(weekOffset: number): Promise<CrossingTime[]>;
  getTideTimesForWeek(weekOffset: number): Promise<TideData[]>;
  getWeatherDataForWeek(weekOffset: number): Promise<WeatherData[]>;
  getCrossingTimesLastUpdated(): Promise<string | null>;
  getTideTimesLastUpdated(): Promise<string | null>;
  getWeatherDataLastUpdated(): Promise<string | null>;
  
  // User preferences and app settings
  getAllUserPreferences(): Promise<UserPreferences[]>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  getAppSettings(): Promise<AppSettings | null>;
  upsertAppSettings(settings: InsertAppSettings): Promise<AppSettings>;
}

// Dynamic database mapper that handles any schema
class DynamicMapper {
  static mapRowToStandardFormat(row: any, type: 'crossing' | 'tide' | 'weather'): any {
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

  static async safeQuery(tableName: string, whereClause: string = '', params: any[] = []): Promise<any[]> {
    const client = await harborPool.connect();
    try {
      const sql = `SELECT * FROM ${tableName} ${whereClause} ORDER BY date`;
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export class DatabaseStorage implements IStorage {
  async getCrossingTimesForWeek(weekOffset: number): Promise<CrossingTime[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    try {
      const whereClause = 'WHERE date >= $1 AND date <= $2';
      const params = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
      
      const rows = await DynamicMapper.safeQuery('harbor_crossing_times', whereClause, params);
      return rows.map(row => DynamicMapper.mapRowToStandardFormat(row, 'crossing'));
    } catch (error) {
      console.error('Harbor database crossing times error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getTideTimesForWeek(weekOffset: number): Promise<TideData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    try {
      const whereClause = 'WHERE date >= $1 AND date <= $2';
      const params = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
      
      const rows = await DynamicMapper.safeQuery('harbor_tide_times', whereClause, params);
      return rows.map(row => DynamicMapper.mapRowToStandardFormat(row, 'tide'));
    } catch (error) {
      console.error('Harbor database tide data error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getWeatherDataForWeek(weekOffset: number): Promise<WeatherData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    try {
      const whereClause = 'WHERE date >= $1 AND date <= $2';
      const params = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
      
      const rows = await DynamicMapper.safeQuery('harbor_weather_data', whereClause, params);
      return rows.map(row => DynamicMapper.mapRowToStandardFormat(row, 'weather'));
    } catch (error) {
      console.error('Harbor database weather data error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getCrossingTimesLastUpdated(): Promise<string | null> {
    try {
      const client = await harborPool.connect();
      const result = await client.query('SELECT created_at FROM harbor_crossing_times ORDER BY created_at DESC LIMIT 1');
      client.release();
      return result.rows[0]?.created_at?.toDateString() || null;
    } catch (error) {
      console.error('Harbor database crossing times timestamp query failed:', error);
      return null;
    }
  }

  async getTideTimesLastUpdated(): Promise<string | null> {
    try {
      const client = await harborPool.connect();
      const result = await client.query('SELECT created_at FROM harbor_tide_times ORDER BY created_at DESC LIMIT 1');
      client.release();
      return result.rows[0]?.created_at?.toDateString() || null;
    } catch (error) {
      console.error('Harbor database tide data timestamp query failed:', error);
      return null;
    }
  }

  async getWeatherDataLastUpdated(): Promise<string | null> {
    try {
      const client = await harborPool.connect();
      const result = await client.query('SELECT created_at FROM harbor_weather_data ORDER BY created_at DESC LIMIT 1');
      client.release();
      return result.rows[0]?.created_at?.toDateString() || null;
    } catch (error) {
      console.error('Harbor database weather data timestamp query failed:', error);
      return null;
    }
  }

  // User preferences using Drizzle (local app tables)
  async getAllUserPreferences(): Promise<UserPreferences[]> {
    try {
      return await harborDb.select().from(userPreferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return [];
    }
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    try {
      const [result] = await harborDb
        .insert(userPreferences)
        .values(preferences)
        .onConflictDoUpdate({
          target: userPreferences.id,
          set: preferences
        })
        .returning();
      return result;
    } catch (error) {
      console.error('Error upserting user preferences:', error);
      throw error;
    }
  }

  async getAppSettings(): Promise<AppSettings | null> {
    try {
      const results = await harborDb.select().from(appSettings).limit(1);
      return results[0] || null;
    } catch (error) {
      console.error('Error fetching app settings:', error);
      return null;
    }
  }

  async upsertAppSettings(settings: InsertAppSettings): Promise<AppSettings> {
    try {
      const [result] = await harborDb
        .insert(appSettings)
        .values(settings)
        .onConflictDoUpdate({
          target: appSettings.id,
          set: settings
        })
        .returning();
      return result;
    } catch (error) {
      console.error('Error upserting app settings:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();