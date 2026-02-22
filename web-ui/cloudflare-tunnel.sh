#!/bin/bash

# Cloudflare Tunnel Deployment for Project Tracking Dashboard

echo "🚀 Setting up Cloudflare Tunnel for Project Tracking Dashboard..."

# Create tunnel
echo "📦 Creating tunnel..."
cloudflared tunnel --url http://localhost:3000 create project-tracking-dashboard

# Get tunnel ID and name
TUNNEL_ID=$(cloudflared tunnel list --format json | jq -r '.[0].id')
TUNNEL_NAME="project-tracking-dashboard"

# Create config
cat > cloudflare-config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /home/clawdonaws/.openclaw/workspace/article-to-flashcards/web-ui/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: project-tracking-dashboard.clawdonaws.workers.dev
    service: http://localhost:3000
  - service: http_status:404
EOF

# Start tunnel in background
cloudflared tunnel --config cloudflare-config.yml run
