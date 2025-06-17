# Fastest Vercel Deployment (5 minutes)

## Option 1: Use Replit's Git Integration
Look in your Replit sidebar for:
- "Version control" icon (branch symbol)
- "Git" in the tools menu
- Three dots menu in file explorer

If found, connect to GitHub and push directly.

## Option 2: Manual File Selection
Open each folder in Replit and copy the contents:

**From client/src/:**
- Copy all component files
- Copy App.tsx, main.tsx, index.css

**From server/:**
- Copy index.ts, routes.ts, storage.ts, db.ts

**From shared/:**
- Copy schema.ts

**Root files to copy:**
- package.json
- vercel.json 
- tsconfig.json

## Quick Upload to Vercel
1. Create new project at vercel.com
2. Choose "Browse" to upload files
3. Add DATABASE_URL environment variable
4. Deploy

Your app will be live with your custom domain in minutes.

## Current Working URL for Users
Share this immediately while deploying:
`https://5f34ca82-88fd-4e6b-86b1-d28886971157-00-2rrp6msl790ey.riker.replit.dev`