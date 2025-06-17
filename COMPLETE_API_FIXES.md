# Complete API Files for Harbor Data Manager

Replace these files in your GitHub repository to fix the schema mismatch:

## 1. api/crossing-times/[weekOffset].js

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { gte, lte } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const crossingTimes = pgTable('crossing_times', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  safeFrom1: text('safe_from_1'),
  safeTo1: text('safe_to_1'),
  safeFrom2: text('safe_from_2'),
  safeTo2: text('safe_to_2'),
  unsafeFrom1: text('unsafe_from_1'),
  unsafeTo1: text('unsafe_to_1'),
  unsafeFrom2: text('unsafe_from_2'),
  unsafeTo2: text('unsafe_to_2'),
  status: text('status').notNull().default('active'),
  notes: text('notes')
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
    const db = drizzle({ client: pool, schema: { crossingTimes } });
    
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    const crossings = await db.select()
      .from(crossingTimes)
      .where(
        gte(crossingTimes.date, startDate)
      )
      .where(
        lte(crossingTimes.date, endDate)
      );
    
    res.status(200).json({ data: crossings });
  } catch (error) {
    console.error('Error fetching crossings:', error);
    res.status(500).json({ error: 'Failed to fetch crossing data', details: error.message });
  }
}
```

## 2. api/tide-times/[weekOffset].js

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { gte, lte } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const tideData = pgTable('tide_data', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  highTide1Time: text('high_tide_1_time'),
  highTide1Height: text('high_tide_1_height'),
  lowTide1Time: text('low_tide_1_time'),
  lowTide1Height: text('low_tide_1_height'),
  highTide2Time: text('high_tide_2_time'),
  highTide2Height: text('high_tide_2_height'),
  lowTide2Time: text('low_tide_2_time'),
  lowTide2Height: text('low_tide_2_height')
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
    const db = drizzle({ client: pool, schema: { tideData } });
    
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    const tides = await db.select()
      .from(tideData)
      .where(
        gte(tideData.date, startDate)
      )
      .where(
        lte(tideData.date, endDate)
      );
    
    res.status(200).json({ data: tides });
  } catch (error) {
    console.error('Error fetching tide data:', error);
    res.status(500).json({ error: 'Failed to fetch tide data', details: error.message });
  }
}
```

## 3. api/weather-data/[weekOffset].js

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { gte, lte } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const weatherData = pgTable('weather_data', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  temperature: integer('temperature'),
  condition: text('condition'),
  description: text('description'),
  windSpeed: integer('wind_speed'),
  humidity: integer('humidity'),
  windDirection: text('wind_direction'),
  temperatureMin: text('temperature_min'),
  temperatureMax: text('temperature_max'),
  precipitationSum: text('precipitation_sum'),
  windSpeedMax: text('wind_speed_max'),
  windDirectionDominant: integer('wind_direction_dominant'),
  uvIndexMax: text('uv_index_max'),
  source: text('source'),
  cloudcover: integer('cloudcover')
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
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
}
```

## Instructions
1. Replace each existing API file with the corrected version above
2. Commit to GitHub
3. Redeploy in Vercel (hopefully faster than 10+ minutes!)
4. Test at https://holy-crosser.vercel.app

Your app will then display authentic maritime data from Harbor Data Manager.