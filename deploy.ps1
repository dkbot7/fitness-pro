# FitPro Production Deploy Script
# Garante que sempre usa chaves de produção (pk_live...)

Write-Host "🚀 FitPro Production Deploy Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Build com chaves de produção locais
Write-Host "📦 Building frontend with production keys..." -ForegroundColor Cyan
Set-Location apps/web
Remove-Item -Path dist -Recurse -Force -ErrorAction SilentlyContinue
pnpm build

Write-Host ""
Write-Host "☁️  Deploying to Cloudflare Pages..." -ForegroundColor Cyan
npx wrangler pages deploy dist --project-name=fitness-pro --commit-dirty=true

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  - Latest Deploy: https://fitness-pro-2ph.pages.dev"
Write-Host "  - Production: https://fitpro.vip"
Write-Host ""
