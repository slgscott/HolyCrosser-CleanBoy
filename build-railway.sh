#!/bin/bash
set -e

echo "Building frontend..."
vite build

echo "Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Copying static files to server/public..."
mkdir -p server/public
if [ -d "dist/public" ]; then
  cp -r dist/public/* server/public/
  echo "Static files copied successfully"
else
  echo "Warning: dist/public directory not found"
  ls -la dist/ || echo "dist directory not found"
fi

echo "Build complete!"