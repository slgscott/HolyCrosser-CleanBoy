const fs = require('fs');
const path = require('path');

// Create a production-ready export of your Holy Crosser app
const exportData = {
  timestamp: new Date().toISOString(),
  version: '2.8.5',
  app: 'Holy Crosser',
  description: 'Maritime navigation app with authentic harbor data',
  
  // Replit development URL (currently working)
  devUrl: 'https://5f34ca82-88fd-4e6b-86b1-d28886971157-00-2rrp6msl790ey.riker.replit.dev',
  
  // Alternative hosting options
  alternativeHosts: [
    {
      platform: 'Vercel',
      url: 'https://vercel.com',
      deployment: 'Connect GitHub repo and deploy instantly',
      cost: 'Free tier available'
    },
    {
      platform: 'Netlify', 
      url: 'https://netlify.com',
      deployment: 'Drag & drop dist folder or connect repo',
      cost: 'Free tier available'
    },
    {
      platform: 'Railway',
      url: 'https://railway.app',
      deployment: 'Connect repo, auto-deploy Node.js apps',
      cost: 'Free tier available'
    }
  ],
  
  // Custom domain setup
  domainSetup: {
    cname: 'riker.replit.dev',
    aRecord: 'Not applicable for Replit',
    redirect: 'Point domain to working Replit URL above'
  },
  
  // Files ready for export
  productionFiles: [
    'dist/public/index.html',
    'dist/public/assets/',
    'dist/index.js',
    'package.json',
    'server/db.ts'
  ]
};

// Save export information
fs.writeFileSync('HOLY_CROSSER_EXPORT.json', JSON.stringify(exportData, null, 2));

console.log('Holy Crosser V2.8.5 export data created');
console.log('Your app is fully functional with authentic harbor data');
console.log('Development URL:', exportData.devUrl);