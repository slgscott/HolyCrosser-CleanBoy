const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Deployment readiness check
app.get('/deploy-ready', (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    version: '2.8.5',
    environment: process.env.NODE_ENV || 'production',
    port: port,
    platform: process.env.REPL_ID ? 'Replit' : 'External',
    nodeVersion: process.version,
    staticFiles: {
      exists: require('fs').existsSync(path.join(__dirname, 'dist/public')),
      indexHtml: require('fs').existsSync(path.join(__dirname, 'dist/public/index.html'))
    }
  };
  
  res.json({ status: 'ready', checks });
});

// Serve built files
const publicPath = path.join(__dirname, 'dist/public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Deployment check server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Platform: ${process.env.REPL_ID ? 'Replit' : 'External'}`);
});