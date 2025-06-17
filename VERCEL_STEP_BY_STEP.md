# Holy Crosser V2.9.0 - Vercel Deployment Steps

## Step 1: Prepare Your Code for Upload

### Option A: Download from Replit
1. In Replit file explorer (left sidebar), look for three dots (⋯) or menu icon
2. Click "Download as ZIP" or "Export"
3. If not found, try right-clicking in the file explorer area

### Option B: Manual File Collection
Create a new folder on your computer called `holy-crosser` and copy these files:

**Root Files:**
- `package.json`
- `vercel.json` 
- `tsconfig.json`
- `tailwind.config.ts`
- `vite.config.ts`
- `drizzle.config.ts`
- `postcss.config.js`
- `components.json`

**Folders (copy entirely):**
- `client/` folder with all contents
- `server/` folder with all contents  
- `shared/` folder with all contents

## Step 2: Upload to Vercel

1. Go to your Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Choose **"Browse"** or **"Upload"**
4. Select your `holy-crosser` folder or ZIP file
5. Click **"Upload"** and wait for file processing

## Step 3: Configure Project Settings

Vercel will auto-detect your project. If prompted:
- **Framework Preset:** Node.js or Auto-detect
- **Root Directory:** Leave as default (.)
- **Build Command:** `npm run build:client`
- **Output Directory:** `client/dist`

## Step 4: Add Environment Variable

**Critical Step - Your app won't work without this:**

1. In project settings, click **"Environment Variables"**
2. Click **"Add New"**
3. Enter:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Environment:** All (Production, Preview, Development)
4. Click **"Save"**

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build process (2-3 minutes)
3. Your app will be live with a Vercel URL like: `holy-crosser-xyz123.vercel.app`

## Step 6: Test Your Deployment

Visit your new Vercel URL and verify:
- ✅ Home page loads with Holy Crosser header
- ✅ Version shows "2.9.0" in top-right corner
- ✅ Crossing times load (authentic harbor data)
- ✅ Tide and weather tabs work
- ✅ Settings page shows app information

## Step 7: Add Your Custom Domain

1. In Vercel project dashboard, click **"Domains"**
2. Click **"Add"**
3. Enter your purchased domain name
4. Vercel will show DNS settings
5. Go to your domain registrar and update DNS:
   - **Type:** CNAME
   - **Name:** @ (or www)
   - **Value:** [the Vercel domain provided]
6. Wait for DNS propagation (up to 24 hours)

## Result

Your users access Holy Crosser via your custom domain with:
- Authentic Northumberland County Council harbor data
- Automatic version display (V2.9.0)
- Free SSL certificate
- Zero downtime hosting

Let me know which step you're on and I'll help with any issues!