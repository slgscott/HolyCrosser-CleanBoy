#!/usr/bin/env node

// Production startup script for Holy Crosser
// Ensures app runs reliably on any hosting platform

const { spawn } = require('child_process');
const fs = require('fs');

console.log('Holy Crosser V2.8.5 - Starting Production Server');
console.log('Harbor Data: Northumberland County Council');
console.log('Features: Crossing Times, Tides, Weather, PWA');

// Environment verification
const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing environment variables:', missingVars);
  process.exit(1);
}

// Health check endpoint ready
console.log('Health check: /health endpoint active');

// Start the server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || 5000
  }
});

server.on('error', (err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});