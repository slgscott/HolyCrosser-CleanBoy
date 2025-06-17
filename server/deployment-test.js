// Minimal deployment test server
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.8.5-test',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/public')));

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});