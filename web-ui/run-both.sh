#!/bin/bash

# Start Server + Cloudflare Tunnel Together

cd "$(dirname "$0")"

echo "🚀 Starting Project Tracking Dashboard..."
echo ""

# Kill any existing processes
pkill -f "npm run dev"
pkill -f cloudflared

# Start server in background
echo "📦 Starting Next.js server..."
nohup npm run dev > server.log 2>&1 &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 8

# Check if server is running
if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ Server failed to start!"
    tail -20 server.log
    exit 1
fi

# Start cloudflared tunnel in background
echo ""
echo "🌐 Starting Cloudflare tunnel..."
nohup cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &
TUNNEL_PID=$!
echo "✅ Tunnel started (PID: $TUNNEL_PID)"

# Wait for tunnel to connect
echo "⏳ Waiting for tunnel to connect..."
sleep 10

# Check if tunnel is still running
if ! ps -p $TUNNEL_PID > /dev/null; then
    echo "❌ Tunnel failed to start!"
    tail -20 tunnel.log
    exit 1
fi

# Get tunnel URL
TUNNEL_URL=$(grep "Your quick Tunnel" tunnel.log | grep -oE 'https://[^ ]+\.trycloudflare\.com' | head -1)

echo ""
echo "✅ Dashboard is ready!"
echo "📍 Local: http://localhost:3000"
echo "🌐 Tunnel: $TUNNEL_URL"
echo ""
echo "Press Ctrl+C to stop both server and tunnel"
echo ""

# Wait for user
wait
