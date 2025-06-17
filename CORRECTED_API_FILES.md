# Corrected API Files for Harbor Data Manager

Copy these corrected files to your GitHub repository to fix the schema mismatch:

## File: api/crossing-times/[weekOffset].js

Replace the existing file with:

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { gte, lte } from 'drizzle-orm';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// Define schema matching Harbor Data Manager
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

## Key Changes
- Updated schema to match Harbor Data Manager column names
- Changed `date` from `date()` to `text()` 
- Added proper columns: `safe_from_1`, `safe_to_1`, etc.
- Removed non-existent columns: `fromTime`, `toTime`, `direction`

Apply the same pattern to tide-times and weather-data API files.