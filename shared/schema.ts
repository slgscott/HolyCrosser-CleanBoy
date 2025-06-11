import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// External Harbor Data Manager tables (read-only)
export const crossingTimes = pgTable("crossing_times", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  safeFrom1: text("safe_from_1"),
  safeTo1: text("safe_to_1"),
  safeFrom2: text("safe_from_2"),
  safeTo2: text("safe_to_2"),
  unsafeFrom1: text("unsafe_from_1"),
  unsafeTo1: text("unsafe_to_1"),
  unsafeFrom2: text("unsafe_from_2"),
  unsafeTo2: text("unsafe_to_2"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
});

export const tideData = pgTable("tide_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  highTide1Time: text("high_tide_1_time"),
  highTide1Height: text("high_tide_1_height"),
  lowTide1Time: text("low_tide_1_time"),
  lowTide1Height: text("low_tide_1_height"),
  highTide2Time: text("high_tide_2_time"),
  highTide2Height: text("high_tide_2_height"),
  lowTide2Time: text("low_tide_2_time"),
  lowTide2Height: text("low_tide_2_height"),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  temperature: integer("temperature"),
  condition: text("condition"),
  description: text("description"),
  windSpeed: integer("wind_speed"),
  humidity: integer("humidity"),
  windDirection: text("wind_direction"),
  temperatureMin: text("temperature_min"),
  temperatureMax: text("temperature_max"),
  precipitationSum: text("precipitation_sum"),
  windSpeedMax: text("wind_speed_max"),
  windDirectionDominant: integer("wind_direction_dominant"),
  uvIndexMax: text("uv_index_max"),
  source: text("source"),
  cloudcover: integer("cloudcover"),
});

// Local preferences tables (for this app's user settings)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  screenType: text("screen_type").notNull(), // 'crossings', 'tides', 'weather'
  column1Name: text("column1_name").notNull(),
  column2Name: text("column2_name").notNull(),
  column3Name: text("column3_name").notNull(),
  column4Name: text("column4_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  autoRefresh: boolean("auto_refresh").default(true),
  refreshInterval: integer("refresh_interval").default(300), // seconds
  theme: text("theme").default("light"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type CrossingTime = typeof crossingTimes.$inferSelect;
export type TideData = typeof tideData.$inferSelect;
export type WeatherData = typeof weatherData.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type AppSettings = typeof appSettings.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
