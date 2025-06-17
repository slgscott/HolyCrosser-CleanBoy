import { 
  crossingTimes,
  tideData,
  weatherData,
  type CrossingTime,
  type TideData,
  type WeatherData
} from "@shared/schema";
import { harborDb } from "./db";
import { gte, lte, and } from "drizzle-orm";

// Import date utils directly since we can't import from client
function getWeekRange(weekOffset: number) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  
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
}

export class DatabaseStorage implements IStorage {
  async getCrossingTimesForWeek(weekOffset: number): Promise<CrossingTime[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    try {
      const results = await harborDb
        .select()
        .from(crossingTimes)
        .where(
          and(
            gte(crossingTimes.date, startDateStr),
            lte(crossingTimes.date, endDateStr)
          )
        )
        .orderBy(crossingTimes.date);
      
      return results;
    } catch (error) {
      console.error('Harbor database crossing times error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getTideTimesForWeek(weekOffset: number): Promise<TideData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    try {
      const results = await harborDb
        .select()
        .from(tideData)
        .where(
          and(
            gte(tideData.date, startDateStr),
            lte(tideData.date, endDateStr)
          )
        )
        .orderBy(tideData.date);
      
      return results;
    } catch (error) {
      console.error('Harbor database tide data error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getWeatherDataForWeek(weekOffset: number): Promise<WeatherData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    try {
      const results = await harborDb
        .select()
        .from(weatherData)
        .where(
          and(
            gte(weatherData.date, startDateStr),
            lte(weatherData.date, endDateStr)
          )
        )
        .orderBy(weatherData.date);
      
      return results;
    } catch (error) {
      console.error('Harbor database weather data error:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getCrossingTimesLastUpdated(): Promise<string | null> {
    try {
      const result = await harborDb.execute(`
        SELECT MAX(updated_at) as last_updated 
        FROM crossing_times 
        WHERE updated_at IS NOT NULL
      `);
      
      if (result.rows && result.rows.length > 0 && (result.rows[0] as any).last_updated) {
        const timestamp = new Date((result.rows[0] as any).last_updated);
        return timestamp.toLocaleString('en-GB', {
          timeZone: 'Europe/London',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Harbor database crossing times timestamp query failed:', error);
    }
    
    return null;
  }

  async getTideTimesLastUpdated(): Promise<string | null> {
    try {
      const result = await harborDb.execute(`
        SELECT MAX(updated_at) as last_updated 
        FROM tide_data 
        WHERE updated_at IS NOT NULL
      `);
      
      if (result.rows && result.rows.length > 0 && (result.rows[0] as any).last_updated) {
        const timestamp = new Date((result.rows[0] as any).last_updated);
        return timestamp.toLocaleString('en-GB', {
          timeZone: 'Europe/London',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Harbor database tide times timestamp query failed:', error);
    }
    
    return null;
  }

  async getWeatherDataLastUpdated(): Promise<string | null> {
    try {
      const result = await harborDb.execute(`
        SELECT MAX(updated_at) as last_updated 
        FROM weather_data 
        WHERE updated_at IS NOT NULL
      `);
      
      if (result.rows && result.rows.length > 0 && (result.rows[0] as any).last_updated) {
        const timestamp = new Date((result.rows[0] as any).last_updated);
        return timestamp.toLocaleString('en-GB', {
          timeZone: 'Europe/London',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Harbor database weather timestamp query failed:', error);
    }
    
    return null;
  }
}

export const storage = new DatabaseStorage();