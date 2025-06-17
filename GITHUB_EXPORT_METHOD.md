# Alternative: Export to GitHub (Easier Method)

## Step 1: Create GitHub Repository
1. Go to github.com and sign in (or create free account)
2. Click "New repository" 
3. Name: `holy-crosser-app`
4. Make it public
5. Click "Create repository"

## Step 2: Connect Replit to GitHub
1. In this Replit project, click the version control icon (looks like a branch) in left sidebar
2. Or look for "Version Control" or "Git" in the tools menu
3. Select "Create a Git repository"
4. Connect to your GitHub account
5. Push to the repository you just created

## Step 3: Deploy to Vercel
1. Go to vercel.com
2. Sign up with your GitHub account
3. Click "New Project" 
4. Select your `holy-crosser-app` repository
5. Vercel will automatically detect it's a Node.js app

## Step 4: Add Database Connection
In Vercel project settings:
- Environment Variables → Add New
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`

## Step 5: Add Your Custom Domain
In Vercel dashboard:
- Domains tab → Add Domain
- Enter your purchased domain
- Follow DNS setup instructions

## Result
Your users access Holy Crosser via your custom domain with zero downtime and all authentic harbor data.