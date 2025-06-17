# Holy Crosser V2.9.0 - Complete Export Package

## Files to Copy for Vercel Deployment

Create a new folder on your computer called `holy-crosser` and copy these files:

### Root Files (copy exactly as shown)
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

### Folder Structure to Create
```
holy-crosser/
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── holy-crosser-icon.png
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   └── vite.ts
└── shared/
    └── schema.ts
```

## Replit File Locations

### In client/src/ folder:
- Copy `App.tsx`, `main.tsx`, `index.css`
- Copy entire `components`, `hooks`, `lib`, `pages` folders

### In server/ folder:
- Copy `index.ts`, `routes.ts`, `storage.ts`, `db.ts`, `vite.ts`

### In shared/ folder:
- Copy `schema.ts`

### In client/ folder:
- Copy `index.html`
- Copy entire `public` folder

## Vercel Upload Steps

1. Zip your `holy-crosser` folder
2. Go to vercel.com → "New Project" → "Browse" 
3. Upload your zip file
4. Add environment variable:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_mtPkeuFTx3H8@ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
5. Add your custom domain in Domains tab

Your users will access via your custom domain with all authentic harbor data.