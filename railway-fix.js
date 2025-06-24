#!/usr/bin/env node

// Railway production fix - copy built files to expected location
import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

console.log('🔧 Railway Static File Fix');

// Ensure server/public exists and copy built files there
const serverPublicPath = path.resolve('server', 'public');
const distPublicPath = path.resolve('dist', 'public');

if (existsSync(distPublicPath)) {
  if (!existsSync('server')) {
    mkdirSync('server', { recursive: true });
  }
  
  console.log(`📁 Copying ${distPublicPath} → ${serverPublicPath}`);
  cpSync(distPublicPath, serverPublicPath, { recursive: true });
  console.log('✅ Static files copied successfully');
} else {
  console.error('❌ Build output not found at:', distPublicPath);
  process.exit(1);
}

// Start the server
console.log('🚀 Starting production server...');
execSync('node dist/index.js', { stdio: 'inherit' });