# Weather API Fix for Harbor Data Manager

Replace `api/weather-data/[weekOffset].js` with this corrected version:

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

## Steps:
1. Replace the existing `api/weather-data/[weekOffset].js` file in GitHub
2. Commit the change
3. Redeploy in Vercel
4. Test at https://holy-crosser.vercel.app

This matches the Harbor Data Manager weather table structure with proper column names.