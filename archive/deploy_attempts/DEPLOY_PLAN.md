# Plano de Deploy - fitpro.vip

## [OK] Status Atual
- [x] Domínio fitpro.vip adicionado ao Cloudflare
- [x] Nameservers propagados
- [x] Cloudflare ativo

## 🎯 Próximos Passos para Deploy

### PASSO 1: Deploy do Backend (API)

**Primeiro deploy do Worker:**

```bash
cd apps/api
npx wrangler deploy
```

Isso vai criar o Worker e te dar uma URL como:
- `https://fitness-pro-api.SEUNOME.workers.dev`

Anote essa URL!

---

### PASSO 2: Deploy do Frontend (Web)

**Build e deploy do Next.js:**

```bash
cd apps/web

# Build da aplicação
pnpm build

# Deploy para Cloudflare Pages
npx wrangler pages deploy .worker-next --project-name=fitness-pro
```

Isso vai criar o Pages e te dar uma URL como:
- `https://fitness-pro.pages.dev`

---

### PASSO 3: Configurar Registros DNS

Após os deploys, adicione no Cloudflare DNS:

**1. Domínio principal (fitpro.vip):**
```
Type: CNAME
Name: @
Target: fitness-pro.pages.dev  (ou o nome que você escolheu)
Proxied: [OK] Sim (nuvem laranja)
TTL: Auto
```

**2. Subdomínio www:**
```
Type: CNAME
Name: www
Target: fitness-pro.pages.dev
Proxied: [OK] Sim
TTL: Auto
```

**3. Subdomínio API:**

Você tem 2 opções:

**Opção A - Via DNS Record** (mais simples):
```
Type: CNAME
Name: api
Target: fitness-pro-api.SEUNOME.workers.dev
Proxied: [OK] Sim
TTL: Auto
```

**Opção B - Via Worker Route** (recomendado):
Adicionar no `apps/api/wrangler.toml`:
```toml
routes = [
  { pattern = "api.fitpro.vip/*", zone_name = "fitpro.vip" }
]
```

Depois fazer novo deploy:
```bash
cd apps/api
npx wrangler deploy
```

---

### PASSO 4: Configurar Domínio Customizado no Pages

Via CLI:
```bash
cd apps/web

# Adicionar domínio customizado
npx wrangler pages project create fitness-pro
npx wrangler pages deployment create .worker-next --project-name=fitness-pro

# Configurar domínio
# Isso precisa ser feito via dashboard por enquanto
```

Via Dashboard:
1. Acesse: https://dash.cloudflare.com/pages
2. Selecione o projeto `fitness-pro`
3. Vá em **Custom domains**
4. Clique **Set up a custom domain**
5. Digite: `fitpro.vip`
6. Clique **Continue** e **Activate domain**
7. Repita para `www.fitpro.vip`

---

### PASSO 5: Configurar Variáveis de Ambiente

**No Cloudflare Pages** (via dashboard):
1. Pages > fitness-pro > Settings > Environment variables
2. Adicione:

**Production:**
```env
NEXT_PUBLIC_API_URL=https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  (trocar)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NODE_VERSION=20
```

**No Cloudflare Workers** (via wrangler CLI):
```bash
cd apps/api

# Database URL (se ainda usar Neon)
echo "YOUR_NEON_URL" | npx wrangler secret put DATABASE_URL

# Clerk
echo "YOUR_CLERK_SECRET" | npx wrangler secret put CLERK_SECRET_KEY
```

---

### PASSO 6: Configurar D1 Database Remoto

**Rodar migrations no D1 de produção:**

```bash
cd apps/api

# Executar cada migration
npx wrangler d1 execute fitness-pro-db --remote --file=migrations/0001_initial_schema.sql
npx wrangler d1 execute fitness-pro-db --remote --file=migrations/0002_gamification.sql
npx wrangler d1 execute fitness-pro-db --remote --file=migrations/0003_seed_achievements.sql
npx wrangler d1 execute fitness-pro-db --remote --file=migrations/0004_seed_exercises.sql
npx wrangler d1 execute fitness-pro-db --remote --file=migrations/0005_seed_placeholder_videos.sql
```

---

### PASSO 7: Atualizar CORS

Editar `apps/api/src/index.ts`:

```typescript
cors({
  origin: [
    'https://fitpro.vip',
    'https://www.fitpro.vip',
    'http://localhost:3000', // Manter para dev
  ],
  credentials: true,
})
```

Fazer novo deploy:
```bash
cd apps/api
npx wrangler deploy
```

---

### PASSO 8: Configurar SSL/TLS

No Cloudflare Dashboard:
1. fitpro.vip > SSL/TLS > Overview
2. Configurar como: **"Full (strict)"**
3. Esperar certificado SSL ser provisionado (~15 minutos)

---

### PASSO 9: Testes

```bash
# Testar API
curl https://api.fitpro.vip/health
# Esperado: {"status":"ok"}

# Testar Frontend
curl -I https://fitpro.vip
# Esperado: HTTP/2 200

# Testar www
curl -I https://www.fitpro.vip
# Esperado: HTTP/2 200
```

---

## 📋 Checklist de Deploy

**Backend:**
- [ ] Worker deployado (`npx wrangler deploy`)
- [ ] D1 migrations rodadas no remoto
- [ ] Secrets configurados (DATABASE_URL, CLERK_SECRET_KEY)
- [ ] Route para api.fitpro.vip configurada
- [ ] CORS atualizado com fitpro.vip

**Frontend:**
- [ ] Build completo (`pnpm build`)
- [ ] Pages deployado
- [ ] Domínio customizado adicionado (fitpro.vip, www.fitpro.vip)
- [ ] Variáveis de ambiente configuradas
- [ ] API_URL apontando para api.fitpro.vip

**DNS:**
- [ ] CNAME @ → fitness-pro.pages.dev
- [ ] CNAME www → fitness-pro.pages.dev
- [ ] Route api.fitpro.vip → Worker configurado

**Segurança:**
- [ ] SSL/TLS: Full (strict)
- [ ] Certificado SSL provisionado
- [ ] Clerk configurado com domínio de produção

**Testes:**
- [ ] https://fitpro.vip carrega
- [ ] https://www.fitpro.vip carrega
- [ ] https://api.fitpro.vip/health responde
- [ ] Login funciona
- [ ] Onboarding funciona

---

## 🚀 Começar Deploy

Quer começar pelo backend ou frontend?

**Recomendação**: Começar pelo backend (API + D1), depois frontend.
