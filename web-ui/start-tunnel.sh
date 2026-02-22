#!/bin/bash

# Start Cloudflare Tunnel for Project Tracking Dashboard

cd "$(dirname "$0")"

# Create tunnel
echo "🚀 Creating Cloudflare tunnel..."
cloudflared tunnel create project-tracking-dashboard

# Get tunnel credentials
TUNNEL_ID=$(cloudflared tunnel list --format json | jq -r '.[0].id')
echo "✅ Tunnel ID: $TUNNEL_ID"

# Create credentials file
cat > .cloudflared/${TUNNEL_ID}.json << EOF
{
  "AccountID": "$CLOUDFLARE_ACCOUNT_ID",
  "TunnelID": "$TUNNEL_ID",
  "TunnelName": "project-tracking-dashboard",
  "TunnelCredentials": {
    "Id": "$TUNNEL_ID",
    "Secret": "$CLOUDFLARE_TUNNEL_SECRET"
  }
}
EOF

# Create tunnel configuration
cat > cloudflare-config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: .cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: project-tracking-dashboard.clawdonaws.workers.dev
    service: http://localhost:3000
  - service: http_status:404
EOF

echo "🎉 Tunnel created!"
echo "🔗 Your dashboard will be available at: https://project-tracking-dashboard.clawdonaws.workers.dev"

# Start tunnel in background
cloudflared tunnel --config cloudflare-config.yml run
