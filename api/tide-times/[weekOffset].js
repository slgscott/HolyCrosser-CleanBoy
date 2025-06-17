import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, date, time, decimal, text, timestamp } from 'drizzle-orm/pg-core';
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
    console.error('Error fetching tides:', error);
    res.status(500).json({ error: 'Failed to fetch tide data' });
  }
}