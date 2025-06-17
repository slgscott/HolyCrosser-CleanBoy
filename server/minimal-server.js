const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

// Enable trust proxy for deployment
app.set('trust proxy', true);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check for deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.8.5-minimal',
    environment: 'production'
  });
});

// Static file serving for production
const publicPath = path.join(__dirname, '../dist/public');
app.use(express.static(publicPath, {
  maxAge: '1y',
  etag: false
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Holy Crosser V2.8.5 serving on port ${port}`);
  console.log('Deployment mode: minimal');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;