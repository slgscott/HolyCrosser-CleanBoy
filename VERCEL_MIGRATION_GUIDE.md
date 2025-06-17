# Holy Crosser Vercel Migration Guide

## Step 1: GitHub Setup (5 minutes)

1. Go to GitHub.com and create new repository
2. Name it: `holy-crosser-app`
3. Make it public
4. Don't initialize with README (we have one)

## Step 2: Upload Your Code

From this Replit project, download these files to your computer:
- All files in `client/` folder
- All files in `server/` folder  
- All files in `shared/` folder
- `vercel.json`
- `README.md`
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `vite.config.ts`
- `drizzle.config.ts`

Upload to your GitHub repository.

## Step 3: Vercel Deployment (3 minutes)

1. Go to vercel.com
2. Sign up with GitHub account
3. Click "New Project"
4. Select your `holy-crosser-app` repository
5. Click "Deploy"

## Step 4: Add Environment Variable

In Vercel dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`

## Step 5: Custom Domain Setup

1. In Vercel project dashboard, click "Domains"
2. Add your purchased domain
3. Vercel will show DNS settings
4. Update your domain registrar with provided DNS records
5. SSL certificate auto-configured

## Result

Your users access Holy Crosser via your custom domain with:
- Authentic harbor crossing data
- Zero downtime
- Free hosting forever
- Automatic updates when you push to GitHub

Total time: 15 minutes