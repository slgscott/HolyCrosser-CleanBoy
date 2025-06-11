import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, insertAppSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get crossing times for a specific week
  app.get("/api/crossing-times/:weekOffset", async (req, res) => {
    try {
      const weekOffset = parseInt(req.params.weekOffset);
      const data = await storage.getCrossingTimesForWeek(weekOffset);
      res.json(data);
    } catch (error) {
      console.error("Error fetching crossing times:", error);
      res.status(500).json({ message: "Failed to fetch crossing times" });
    }
  });

  // Get tide times for a specific week
  app.get("/api/tide-times/:weekOffset", async (req, res) => {
    try {
      const weekOffset = parseInt(req.params.weekOffset);
      const data = await storage.getTideTimesForWeek(weekOffset);
      res.json(data);
    } catch (error) {
      console.error("Error fetching tide times:", error);
      res.status(500).json({ message: "Failed to fetch tide times" });
    }
  });

  // Get weather data for a specific week
  app.get("/api/weather-data/:weekOffset", async (req, res) => {
    try {
      const weekOffset = parseInt(req.params.weekOffset);
      const data = await storage.getWeatherDataForWeek(weekOffset);
      res.json(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.getAllUserPreferences();
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.upsertUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid preferences data", errors: error.errors });
      } else {
        console.error("Error updating preferences:", error);
        res.status(500).json({ message: "Failed to update preferences" });
      }
    }
  });

  // Get app settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAppSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update app settings
  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertAppSettingsSchema.parse(req.body);
      const settings = await storage.upsertAppSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
