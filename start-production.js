#!/usr/bin/env node

// Production startup script for Railway deployment
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🚀 Holy Crosser v2.9.5 - Railway Production Startup');
console.log('===============================================');

// Check environment
const requiredEnvs = ['DATABASE_URL'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvs.join(', '));
  process.exit(1);
}

console.log('✅ Environment variables verified');
console.log(`📍 Platform: ${process.env.RAILWAY_ENVIRONMENT ? 'Railway' : 'Other'}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

// Verify build exists
try {
  const stats = readFileSync('dist/index.js');
  console.log('✅ Production build found');
} catch (err) {
  console.error('❌ Production build not found - run npm run build first');
  process.exit(1);
}

// Start the application
console.log('🎯 Starting Holy Crosser server...');
try {
  execSync('node dist/index.js', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
}