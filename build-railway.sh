#!/bin/bash
set -e

echo "Building frontend with Vite..."
vite build

echo "Verifying build output..."
ls -la dist/ || echo "No dist directory"

echo "Creating server/public directory..."
mkdir -p server/public

echo "Copying static files..."
if [ -d "dist/public" ]; then
  cp -r dist/public/* server/public/
  echo "Static files copied from dist/public to server/public"
  ls -la server/public/ | head -10
else
  echo "dist/public not found, checking other locations..."
  find . -name "index.html" -type f | grep -v node_modules | head -5
  if [ -d "dist" ]; then
    echo "Contents of dist directory:"
    ls -la dist/
    # Try copying from dist root if dist/public doesn't exist
    cp -r dist/* server/public/ 2>/dev/null || echo "Failed to copy from dist root"
  fi
fi

echo "Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Final server/public contents:"
ls -la server/public/ | head -10 || echo "server/public is empty"

echo "Build complete!"