// Direct deployment script - creates production-ready package
const fs = require('fs');
const path = require('path');

console.log('Creating direct deployment package...');

// Create deployment directory
if (!fs.existsSync('deploy-package')) {
  fs.mkdirSync('deploy-package');
}

// Copy all necessary files
const filesToCopy = [
  'package.json',
  'vercel.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'components.json',
  'drizzle.config.ts'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('deploy-package', file));
    console.log(`Copied ${file}`);
  }
});

// Copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy essential directories
['client', 'server', 'shared', 'api'].forEach(dir => {
  if (fs.existsSync(dir)) {
    copyDir(dir, path.join('deploy-package', dir));
    console.log(`Copied ${dir}/ directory`);
  }
});

// Create version-fixed health endpoint
const healthContent = `// Holy Crosser v2.9.1 - Direct deployment version
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production',
    deployment: 'direct'
  });
}`;

fs.writeFileSync(path.join('deploy-package', 'api', 'health.js'), healthContent);

console.log('✅ Direct deployment package ready in deploy-package/');
console.log('📦 Upload this folder directly to Vercel for guaranteed v2.9.1 deployment');