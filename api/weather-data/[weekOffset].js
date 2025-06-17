import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, date, time, decimal, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { gte, lte } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const weatherData = pgTable('weather_data', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  temperature: decimal('temperature', { precision: 4, scale: 1 }).notNull(),
  windSpeed: decimal('wind_speed', { precision: 4, scale: 1 }).notNull(),
  windDirection: integer('wind_direction').notNull(),
  description: text('description').notNull(),
  lastUpdated: timestamp('last_updated')
});

function getWeekRange(weekOffset) {
  const now = new Date();
  const currentDay = now.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const { start, end } = getWeekRange(weekOffset);
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool, schema: { weatherData } });
    
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    const weather = await db.select()
      .from(weatherData)
      .where(
        gte(weatherData.date, startDate)
      )
      .where(
        lte(weatherData.date, endDate)
      );
    
    res.status(200).json({ data: weather });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}