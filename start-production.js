#!/usr/bin/env node

// Production startup script with enhanced deployment compatibility
process.env.NODE_ENV = 'production';

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Holy Crosser V2.8.5 in production mode...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Platform:', process.env.REPL_ID ? 'Replit' : 'External');

// Start the production server
const serverPath = path.join(__dirname, 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '5000'
  }
});

// Handle server exit
server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});