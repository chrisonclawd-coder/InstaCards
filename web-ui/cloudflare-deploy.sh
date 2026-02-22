#!/bin/bash

# Cloudflare Pages Deployment Script for Article-to-Flashcards

echo "🚀 Deploying Article-to-Flashcards to Cloudflare Pages..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Next.js app
echo "🔨 Building Next.js app..."
npm run build

# Output build directory
echo "✅ Build complete!"
echo "📍 Build output: .next/"
echo ""
echo "📝 To deploy to Cloudflare Pages:"
echo "1. Push this repository to GitHub"
echo "2. Connect GitHub to Cloudflare Pages"
echo "3. Select the repository and branch"
echo "4. Cloudflare will automatically build and deploy"
echo ""
echo "💡 Or use wrangler:"
echo "   npm install -g wrangler"
echo "   wrangler pages deploy .next --project-name=article-to-flashcards"
