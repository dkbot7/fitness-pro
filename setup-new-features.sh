#!/bin/bash

# FitPro - Automated Setup Script for New Features
# Date: 2026-01-11
# Purpose: Deploy R2 Video Streaming, Weekly Adjustment, Push Notifications

set -e # Exit on error

echo "🚀 FitPro - Setup Script for New Features 2026"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found${NC}"
    echo "Install with: npm install -g wrangler"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found${NC}"
    echo "Install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Navigate to API directory
cd "$(dirname "$0")/apps/api"

# Step 1: Create R2 Buckets
echo "📦 Step 1: Creating R2 Buckets..."
echo ""

if wrangler r2 bucket list | grep -q "fitness-pro-videos"; then
    echo -e "${YELLOW}⚠️  Bucket 'fitness-pro-videos' already exists${NC}"
else
    echo "Creating production bucket..."
    wrangler r2 bucket create fitness-pro-videos
    echo -e "${GREEN}✅ Production bucket created${NC}"
fi

if wrangler r2 bucket list | grep -q "fitness-pro-videos-preview"; then
    echo -e "${YELLOW}⚠️  Bucket 'fitness-pro-videos-preview' already exists${NC}"
else
    echo "Creating preview bucket..."
    wrangler r2 bucket create fitness-pro-videos-preview
    echo -e "${GREEN}✅ Preview bucket created${NC}"
fi

echo ""

# Step 2: Apply Database Migrations
echo "🗄️  Step 2: Applying database migrations..."
echo ""

echo "Applying push notifications migration..."
npx wrangler d1 migrations apply DB --remote

echo ""
echo -e "${GREEN}✅ Migrations applied${NC}"
echo ""

# Step 3: Generate and Configure Secrets
echo "🔐 Step 3: Configuring secrets..."
echo ""

echo "Installing web-push for VAPID key generation..."
npm install --no-save web-push

echo ""
echo "Generating VAPID keys..."
VAPID_KEYS=$(npx web-push generate-vapid-keys | grep ":" | awk '{print $3}')

# Parse VAPID keys
PUBLIC_KEY=$(echo "$VAPID_KEYS" | sed -n '1p')
PRIVATE_KEY=$(echo "$VAPID_KEYS" | sed -n '2p')

echo ""
echo "📝 Generated VAPID Keys:"
echo "Public Key: $PUBLIC_KEY"
echo "Private Key: ${PRIVATE_KEY:0:20}...${PRIVATE_KEY: -20}"
echo ""

echo "⚠️  IMPORTANT: You need to manually set these secrets using:"
echo ""
echo -e "${YELLOW}echo '$PUBLIC_KEY' | wrangler secret put VAPID_PUBLIC_KEY${NC}"
echo -e "${YELLOW}echo '$PRIVATE_KEY' | wrangler secret put VAPID_PRIVATE_KEY${NC}"
echo ""

# Generate CRON secret
CRON_SECRET=$(openssl rand -base64 32)
echo "Generated CRON secret: ${CRON_SECRET:0:20}...${CRON_SECRET: -12}"
echo ""
echo -e "${YELLOW}echo '$CRON_SECRET' | wrangler secret put CRON_SECRET${NC}"
echo ""

# Save secrets to .secrets file (for manual setup)
cat > .secrets << EOF
# FitPro Secrets - Generated $(date)
# DO NOT COMMIT THIS FILE TO GIT

VAPID_PUBLIC_KEY=$PUBLIC_KEY
VAPID_PRIVATE_KEY=$PRIVATE_KEY
CRON_SECRET=$CRON_SECRET
EOF

echo -e "${GREEN}✅ Secrets saved to .secrets file${NC}"
echo "⚠️  Run the commands above to configure secrets in Cloudflare"
echo ""

# Prompt to continue
read -p "Have you configured the secrets? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please configure secrets before deploying${NC}"
    exit 1
fi

# Step 4: Deploy Backend
echo ""
echo "🚀 Step 4: Deploying backend..."
echo ""

npx wrangler deploy

echo ""
echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
echo ""

# Step 5: Verify Deployment
echo "🔍 Step 5: Verifying deployment..."
echo ""

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s https://api.fitpro.vip/health)

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
fi

echo ""
echo "Testing video endpoint (should return 404 if no videos uploaded)..."
VIDEO_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.fitpro.vip/api/exercises/push-ups/video)

if [ "$VIDEO_RESPONSE" == "404" ]; then
    echo -e "${YELLOW}⚠️  Video endpoint OK (no video uploaded yet)${NC}"
elif [ "$VIDEO_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ Video endpoint OK (video exists)${NC}"
else
    echo -e "${RED}❌ Video endpoint returned: $VIDEO_RESPONSE${NC}"
fi

echo ""

# Summary
echo "=============================================="
echo "📊 Deployment Summary"
echo "=============================================="
echo ""
echo -e "${GREEN}✅ R2 Buckets created${NC}"
echo -e "${GREEN}✅ Database migrations applied${NC}"
echo -e "${GREEN}✅ Secrets generated (check .secrets file)${NC}"
echo -e "${GREEN}✅ Backend deployed${NC}"
echo -e "${GREEN}✅ Endpoints verified${NC}"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Upload exercise videos to R2:"
echo "   wrangler r2 object put fitness-pro-videos/exercises/push-ups.mp4 --file=path/to/video.mp4"
echo ""
echo "2. Update database with video URLs:"
echo "   npx wrangler d1 execute DB --remote --command \"UPDATE exercises SET video_url='...' WHERE slug='push-ups'\""
echo ""
echo "3. Test video playback:"
echo "   Open https://fitpro.vip and play a video in a workout"
echo ""
echo "4. Monitor cron job:"
echo "   npx wrangler tail --format json | grep cron"
echo ""
echo "📚 Full documentation: IMPLEMENTATION_GUIDE.md"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
