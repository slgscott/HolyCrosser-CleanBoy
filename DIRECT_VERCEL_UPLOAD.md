# Direct Vercel Upload Method

## What You Need to Copy

Copy these specific files and folders to upload to Vercel:

### Essential Folders
- `client/` (entire folder with all contents)
- `server/` (entire folder with all contents) 
- `shared/` (entire folder with all contents)

### Essential Files
- `package.json`
- `vercel.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `vite.config.ts`
- `drizzle.config.ts`
- `postcss.config.js`
- `components.json`

## Upload Steps

1. **Create new folder** on your computer called `holy-crosser-upload`

2. **Copy files manually**: 
   - Select each file/folder above
   - Copy to your new folder
   - Maintain the folder structure

3. **Zip the folder**: Right-click → "Compress" or "Send to → Compressed folder"

4. **Upload to Vercel**:
   - Go to vercel.com
   - Click "Deploy" 
   - Select "Browse" and choose your zip file

5. **Add environment variable**:
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`

6. **Configure domain**: Add your purchased custom domain

Your users will access Holy Crosser via your custom domain with all authentic harbor data.