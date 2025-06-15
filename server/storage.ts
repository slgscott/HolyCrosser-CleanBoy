import { 
  users, 
  userPreferences, 
  appSettings,
  crossingTimes,
  tideData,
  weatherData,
  type User, 
  type InsertUser,
  type UserPreferences,
  type InsertUserPreferences,
  type AppSettings,
  type InsertAppSettings,
  type CrossingTime,
  type TideData,
  type WeatherData
} from "@shared/schema";
import { db, harborDb } from "./db";
import { eq, gte, lte, desc, and } from "drizzle-orm";
// Import date utils directly since we can't import from client
function getWeekRange(weekOffset: number) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysFromMonday + (weekOffset * 7));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startDate: startOfWeek, endDate: endOfWeek };
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Harbor data (read-only from external database)
  getCrossingTimesForWeek(weekOffset: number): Promise<CrossingTime[]>;
  getTideTimesForWeek(weekOffset: number): Promise<TideData[]>;
  getWeatherDataForWeek(weekOffset: number): Promise<WeatherData[]>;
  
  // User preferences (local database)
  getAllUserPreferences(): Promise<UserPreferences[]>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // App settings (local database)
  getAppSettings(): Promise<AppSettings | undefined>;
  upsertAppSettings(settings: InsertAppSettings): Promise<AppSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCrossingTimesForWeek(weekOffset: number): Promise<CrossingTime[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
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
  }

  async getTideTimesForWeek(weekOffset: number): Promise<TideData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
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
  }

  async getWeatherDataForWeek(weekOffset: number): Promise<WeatherData[]> {
    const { startDate, endDate } = getWeekRange(weekOffset);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
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
  }

  async getAllUserPreferences(): Promise<UserPreferences[]> {
    const results = await db.select().from(userPreferences);
    return results;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    // Check if preferences exist for this screen type
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.screenType, preferences.screenType));
    
    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(userPreferences)
        .set({
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.screenType, preferences.screenType))
        .returning();
      return updated;
    } else {
      // Insert new
      const [inserted] = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return inserted;
    }
  }

  async getAppSettings(): Promise<AppSettings | undefined> {
    const [settings] = await db.select().from(appSettings).orderBy(desc(appSettings.id));
    return settings || undefined;
  }

  async upsertAppSettings(settings: InsertAppSettings): Promise<AppSettings> {
    const existing = await db.select().from(appSettings).orderBy(desc(appSettings.id));
    
    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(appSettings)
        .set({
          ...settings,
          updatedAt: new Date()
        })
        .where(eq(appSettings.id, existing[0].id))
        .returning();
      return updated;
    } else {
      // Insert new
      const [inserted] = await db
        .insert(appSettings)
        .values(settings)
        .returning();
      return inserted;
    }
  }
}

export const storage = new DatabaseStorage();