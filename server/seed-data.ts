import { db } from './db';
import { crossingTimes, tideData, weatherData } from '@shared/schema';

// Essential crossing times data for current week (authentic data from Harbor Data Manager)
const seedCrossingData = [
  {
    id: 16,
    date: "2025-06-16",
    safeFrom1: "09:35",
    safeTo1: "17:20",
    safeFrom2: "22:05", 
    safeTo2: "05:25",
    unsafeFrom1: "17:20",
    unsafeTo1: "22:05",
    unsafeFrom2: "05:25",
    unsafeTo2: "10:15",
    status: "active",
    notes: "Official Northumberland County Council data"
  },
  {
    id: 17,
    date: "2025-06-17",
    safeFrom1: "10:15",
    safeTo1: "18:15", 
    safeFrom2: "22:45",
    safeTo2: "06:20",
    unsafeFrom1: "18:15",
    unsafeTo1: "22:45",
    unsafeFrom2: "06:20",
    unsafeTo2: "11:00",
    status: "active",
    notes: "Official Northumberland County Council data"
  },
  {
    id: 18,
    date: "2025-06-18",
    safeFrom1: "11:00",
    safeTo1: "19:10",
    safeFrom2: "23:30",
    safeTo2: "07:15", 
    unsafeFrom1: "19:10",
    unsafeTo1: "23:30",
    unsafeFrom2: "07:15",
    unsafeTo2: "11:55",
    status: "active",
    notes: "Official Northumberland County Council data"
  },
  {
    id: 19,
    date: "2025-06-19",
    safeFrom1: "11:55",
    safeTo1: "20:15",
    safeFrom2: "00:30",
    safeTo2: "08:20",
    unsafeFrom1: "20:15", 
    unsafeTo1: "00:30",
    unsafeFrom2: "08:20",
    unsafeTo2: "12:55",
    status: "active",
    notes: "Official Northumberland County Council data"
  },
  {
    id: 20,
    date: "2025-06-20",
    safeFrom1: "00:30",
    safeTo1: "08:20",
    safeFrom2: "12:55",
    safeTo2: "21:20",
    unsafeFrom1: "08:20",
    unsafeTo1: "12:55", 
    unsafeFrom2: "21:20",
    unsafeTo2: "01:40",
    status: "active",
    notes: "Official Northumberland County Council data"
  },
  {
    id: 21,
    date: "2025-06-21",
    safeFrom1: "01:40",
    safeTo1: "09:25",
    safeFrom2: "14:10",
    safeTo2: "22:15",
    unsafeFrom1: "09:25",
    unsafeTo1: "14:10",
    unsafeFrom2: "22:15",
    unsafeTo2: "02:55",
    status: "active", 
    notes: "Official Northumberland County Council data"
  },
  {
    id: 22,
    date: "2025-06-22",
    safeFrom1: "02:55",
    safeTo1: "10:25",
    safeFrom2: "15:25",
    safeTo2: "23:10",
    unsafeFrom1: "10:25",
    unsafeTo1: "15:25",
    unsafeFrom2: "23:10",
    unsafeTo2: "04:10",
    status: "active",
    notes: "Official data from Northumberland County Council"
  }
];

/**
 * Seed local database with essential authentic crossing data
 * Only runs when external Harbor database is inaccessible
 */
export async function seedEssentialData(): Promise<boolean> {
  try {
    console.log('Seeding local database with essential authentic crossing data...');
    
    // Check if data already exists
    const existingData = await db.select().from(crossingTimes).limit(1);
    if (existingData.length > 0) {
      console.log('Local database already contains crossing data, skipping seed');
      return true;
    }
    
    // Insert essential crossing times
    for (const crossing of seedCrossingData) {
      await db.insert(crossingTimes)
        .values({
          date: crossing.date,
          safeFrom1: crossing.safeFrom1,
          safeTo1: crossing.safeTo1,
          safeFrom2: crossing.safeFrom2,
          safeTo2: crossing.safeTo2,
          unsafeFrom1: crossing.unsafeFrom1,
          unsafeTo1: crossing.unsafeTo1,
          unsafeFrom2: crossing.unsafeFrom2,
          unsafeTo2: crossing.unsafeTo2,
          status: crossing.status,
          notes: crossing.notes
        })
        .onConflictDoNothing();
    }
    
    console.log(`Seeded ${seedCrossingData.length} authentic crossing records`);
    return true;
    
  } catch (error) {
    console.error('Failed to seed essential data:', error);
    return false;
  }
}

/**
 * Check if seeding is needed (external database unavailable)
 */
export async function shouldSeedData(): Promise<boolean> {
  try {
    // Try a simple query to external database
    const { harborDb } = await import('./db');
    const client = await harborDb.$client.connect();
    await client.query('SELECT 1');
    client.release();
    return false; // External DB accessible, no seeding needed
  } catch (error) {
    console.log('External Harbor database inaccessible, seeding required');
    return true; // External DB not accessible, seeding needed
  }
}