# Deploy from HolyCrosserMobile Repository

## Step 1: Update Your GitHub Repository

First, we need to push your V2.9.0 code to your existing `HolyCrosserMobile` repository.

**If you have push access to HolyCrosserMobile:**
1. Copy the essential files from this Replit to your local computer
2. Update your local HolyCrosserMobile repository 
3. Push to GitHub

**Files to copy from Replit:**
```
package.json
vercel.json (NEW - for deployment)
tsconfig.json
tailwind.config.ts
vite.config.ts
drizzle.config.ts
postcss.config.js
components.json
client/ (entire folder)
server/ (entire folder)
shared/ (entire folder)
```

## Step 2: Connect HolyCrosserMobile to Vercel

1. In **Vercel dashboard**, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select **"HolyCrosserMobile"** repository
4. Click **"Import"**

## Step 3: Configure Deployment Settings

Vercel will scan your repository. Configure:
- **Framework Preset:** Node.js
- **Root Directory:** `./` (leave default)
- **Build Command:** `npm run build:client`
- **Output Directory:** `client/dist`

## Step 4: Add Environment Variable

**Critical for harbor data connection:**
1. Go to **Environment Variables** in project settings
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments:** All

## Step 5: Deploy

1. Click **"Deploy"**
2. Vercel builds and deploys automatically
3. Get your live URL: `https://holycrossermobile-[hash].vercel.app`

## Step 6: Add Your Custom Domain

1. **Domains** tab in Vercel project
2. Add your purchased domain
3. Configure DNS at your domain registrar
4. Users access via your custom domain

## Alternative: Direct Repository Upload

If you can't push to HolyCrosserMobile:
1. Create new branch in your GitHub repository
2. Upload V2.9.0 files via GitHub web interface
3. Merge to main branch
4. Connect to Vercel

Which approach works best for your HolyCrosserMobile repository?