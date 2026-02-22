#!/bin/bash

# Cloudflare Tunnel with Dev Server

echo "🚀 Starting Project Tracking Dashboard with Cloudflare Tunnel..."
echo ""

# Start tunnel in background
echo "📦 Starting Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to start
sleep 5

# Get tunnel URL from log
TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare.com' tunnel.log | head -1)

echo "✅ Tunnel started!"
echo "📍 Your dashboard is available at:"
echo ""
echo "🌐 $TUNNEL_URL"
echo ""

# Wait for user
echo "Press Ctrl+C to stop both tunnel and server..."
wait
