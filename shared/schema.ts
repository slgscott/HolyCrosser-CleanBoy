import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// External Harbor Data Manager tables (read-only)
export const harborCrossingTimes = pgTable("harbor_crossing_times", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  morning: text("morning"),
  midday: text("midday"),
  evening: text("evening"),
  night: text("night"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const harborTideTimes = pgTable("harbor_tide_times", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  highTide1: text("high_tide_1"),
  lowTide1: text("low_tide_1"),
  highTide2: text("high_tide_2"),
  lowTide2: text("low_tide_2"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const harborWeatherData = pgTable("harbor_weather_data", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  temperature: text("temperature"),
  windSpeed: text("wind_speed"),
  precipitation: text("precipitation"),
  visibility: text("visibility"),
  createdAt: timestamp("created_at").defaultNow(),
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
export type HarborCrossingTime = typeof harborCrossingTimes.$inferSelect;
export type HarborTideTime = typeof harborTideTimes.$inferSelect;
export type HarborWeatherData = typeof harborWeatherData.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type AppSettings = typeof appSettings.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
