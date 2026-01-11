# Deployment Notes - FitPro

## 2026-01-11: Fixed Onboarding "Failed to fetch" Error

### Problem
Users were getting "Erro inesperado - Failed to fetch" during onboarding (step 4).

### Root Causes
1. **CORS Issue**: Backend wasn't allowing Cloudflare Pages deployment URLs (`*.pages.dev`)
2. **Wrong API URL in Bundle**: Frontend was using old Worker URL instead of custom domain

### Solutions Applied

#### 1. CORS Fix (`apps/api/src/index.ts`)
Changed CORS middleware from array to function to support regex pattern matching:
```typescript
app.use('/*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://fitness-pro.pages.dev',
      'https://fitpro.vip',
      'https://www.fitpro.vip',
    ];

    if (allowedOrigins.includes(origin)) return origin;

    // Allow *.pages.dev deployments
    if (origin && /^https:\/\/[a-z0-9-]+\.fitness-pro.*\.pages\.dev$/.test(origin)) {
      return origin;
    }

    return allowedOrigins[0];
  },
  credentials: true,
}));
```

#### 2. API URL Fix
**Files to update locally** (not committed, in .gitignore):
- `apps/web/.env.production.local`
- Change `VITE_API_URL=https://fitness-pro-api.chatbotimoveis.workers.dev`
- To: `VITE_API_URL=https://api.fitpro.vip`

**Note**: `.env.production.local` has highest priority in Vite's env loading order:
1. .env
2. .env.local
3. .env.[mode]
4. .env.[mode].local ← **Highest priority**

### Current Deployment URLs
- **Backend API**: https://api.fitpro.vip
- **Frontend PWA**: https://cf2b3cef.fitness-pro-2ph.pages.dev
- **Main Domain**: https://fitpro.vip (to be configured)

### Verification
```bash
# Test CORS
curl -v https://api.fitpro.vip/health \
  -H "Origin: https://cf2b3cef.fitness-pro-2ph.pages.dev"
# Should return: Access-Control-Allow-Origin: https://cf2b3cef.fitness-pro-2ph.pages.dev

# Check bundle URL
curl -s "https://cf2b3cef.fitness-pro-2ph.pages.dev/assets/index-*.js" | grep "api.fitpro.vip"
# Should find: api.fitpro.vip
```

### Related Commits
- `90bed78`: fix(cors): Fix CORS to allow Cloudflare Pages deployments
- `13c929f`: chore: add .secrets to gitignore
- `076067c`: feat(api): Configure custom domain route api.fitpro.vip
