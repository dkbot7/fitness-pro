#!/bin/bash
set -e

echo "🚀 FitPro Production Deploy Script"
echo "===================================="
echo ""

# Build com chaves de produção locais
echo "📦 Building frontend with production keys..."
cd apps/web
rm -rf dist
pnpm build

echo ""
echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=fitness-pro --commit-dirty=true

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "URLs:"
echo "  - Latest Deploy: https://fitness-pro-2ph.pages.dev"
echo "  - Production: https://fitpro.vip"
echo ""
