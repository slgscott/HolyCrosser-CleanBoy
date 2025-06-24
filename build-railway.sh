#!/bin/bash
set -e

echo "Building frontend..."
npm run build

echo "Copying static files to server/public..."
mkdir -p server/public
cp -r dist/public/* server/public/

echo "Build complete!"