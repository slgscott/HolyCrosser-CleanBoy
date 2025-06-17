// Direct server for public access
const express = require('express');
const { createServer } = require('http');
const path = require('path');

const app = express();

// Trust proxy for external access
app.set('trust proxy', true);

// Enable CORS for external access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    version: '2.8.5',
    timestamp: new Date().toISOString(),
    app: 'Holy Crosser',
    source: 'public-server'
  });
});

// Proxy API requests to main server
app.get('/api/*', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:5000${req.path}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Main server unavailable' });
  }
});

// Serve static files from main build
app.use(express.static(path.join(__dirname, '../dist/public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

// Start on alternative port
const port = 3000;
const server = createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Holy Crosser public access server running on port ${port}`);
  console.log(`Main app proxied from localhost:5000`);
});

module.exports = { app, server };