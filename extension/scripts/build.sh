#!/bin/bash

echo "🔨 Building Article-to-Flashcards Extension..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build TypeScript
echo "📦 Building TypeScript..."
npm run build

# Copy HTML and icon files
echo "📄 Copying HTML and icon files..."
cp popup.html dist/
cp options.html dist/
cp content-ui.html dist/

echo "✅ Build complete!"
echo "📁 Output directory: dist/"

# Copy icons
echo "🖼️  Copying icons..."
mkdir -p dist/icons
cp icons/icon16.png dist/icons/
cp icons/icon48.png dist/icons/
cp icons/icon128.png dist/icons/

echo "✅ Icons copied!"
