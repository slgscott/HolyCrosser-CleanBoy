# Simple Schema Fix for Harbor Data Manager

## Problem
API functions expect different column names than Harbor Data Manager database.

## Quick Fix
Update these lines in your GitHub repository:

### In `api/crossing-times/[weekOffset].js`
Change line 12-16 from:
```javascript
  date: date('date').notNull(),
  fromTime: time('from_time').notNull(),
  toTime: time('to_time').notNull(),
  direction: text('direction').notNull(),
```

To:
```javascript
  date: text('date').notNull(),
  safeFrom1: text('safe_from_1'),
  safeTo1: text('safe_to_1'),
  safeFrom2: text('safe_from_2'),
  safeTo2: text('safe_to_2'),
```

This matches the actual Harbor Data Manager column names.

## Result
API will connect properly to your maritime data instead of failing with column errors.