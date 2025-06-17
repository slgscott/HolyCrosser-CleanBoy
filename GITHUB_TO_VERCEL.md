# Deploy Holy Crosser via GitHub → Vercel

## Step 1: Create GitHub Repository

1. Go to **github.com** and sign in (or create free account)
2. Click **"New repository"** (green button)
3. Repository name: `holy-crosser`
4. Make it **Public**
5. Don't initialize with README
6. Click **"Create repository"**

## Step 2: Upload Your Code to GitHub

Since Replit has git restrictions, use the manual upload method:

1. **Download files from Replit:**
   - Right-click in file explorer and look for "Download" option
   - Or manually copy essential files (see list below)

2. **Essential files to copy:**
   ```
   package.json
   vercel.json
   tsconfig.json
   tailwind.config.ts
   vite.config.ts
   drizzle.config.ts
   postcss.config.js
   components.json
   ```

3. **Copy these folders entirely:**
   - `client/` (all contents)
   - `server/` (all contents)  
   - `shared/` (all contents)

4. **Upload to GitHub:**
   - In your new GitHub repo, click "uploading an existing file"
   - Drag and drop all files/folders
   - Commit with message: "Holy Crosser V2.9.0 initial upload"

## Step 3: Connect GitHub to Vercel

1. In **Vercel dashboard**, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your GitHub account
4. Choose your `holy-crosser` repository
5. Click **"Import"**

## Step 4: Configure Vercel Project

Vercel will auto-detect settings. Verify:
- **Framework:** Node.js
- **Root Directory:** `./`
- **Build Command:** `npm run build:client`
- **Output Directory:** `client/dist`

## Step 5: Add Database Environment Variable

**Critical:** In Vercel project settings:
1. Click **"Environment Variables"**
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments:** All (Production, Preview, Development)

## Step 6: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your live URL: `https://holy-crosser-[random].vercel.app`

## Step 7: Add Custom Domain

1. **Domains** tab in Vercel
2. Add your purchased domain
3. Follow DNS configuration instructions
4. Users access via your custom domain

Which step would you like help with first?