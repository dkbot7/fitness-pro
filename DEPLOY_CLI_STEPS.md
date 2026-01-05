# Deploy via CLI - Status e Próximos Passos

**Data**: 05/01/2026
**Último Commit**: 0366f40 - OpenNext Cloudflare adapter configurado

---

## ✅ CONCLUÍDO VIA CLI

### 1. Autenticação Wrangler
```bash
✅ Autenticado como: chatbotimoveis@gmail.com
✅ Account ID: ce11d202b2917777965b5131b5edc627
✅ Permissões: pages (write), workers (write), d1 (write)
```

### 2. Commits e Push
```bash
✅ cbd9705 - Correção build command e documentação
✅ 0366f40 - Configuração OpenNext Cloudflare adapter completo
✅ Push para origin/main realizado
```

### 3. Deployment Automático Triggerado
```bash
✅ Deployment ID: 0366f40
✅ Status: Active (build completou)
✅ URL temporária: https://750be74f.fitness-pro-2ph.pages.dev
✅ Dashboard: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/750be74f-3696-411b-b6b6-83e3fc9f02fa
```

### 4. open-next.config.ts
```typescript
✅ Configurado com todos os overrides necessários:
   - wrapper: cloudflare-node
   - converter: edge
   - proxyExternalRequest: fetch
   - incrementalCache: dummy
   - tagCache: dummy
   - queue: dummy
   - middleware externo
```

---

## ⚠️ PROBLEMA ATUAL

### Erro 522 - Connection Timeout
```
Status: HTTP 522
Causa: Worker não está respondendo
URL: https://750be74f.fitness-pro-2ph.pages.dev
```

**Possíveis Causas**:
1. ❌ Variáveis de ambiente não configuradas
2. ❌ Build settings incorretos (ainda usando comando antigo)
3. ❌ Erro em runtime do worker

---

## 🔧 AÇÕES NECESSÁRIAS (VIA DASHBOARD)

### 1. Configurar Variáveis de Ambiente (CRÍTICO)

**Acesse**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/environment-variables

**Adicione** (Production):
```
NODE_VERSION = 20
NEXT_PUBLIC_API_URL = https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
```

### 2. Verificar e Atualizar Build Command

**Acesse**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

**Verifique se está assim**:
```yaml
Framework preset: Next.js
Build command: pnpm install --frozen-lockfile && cd apps/web && pnpm build && npx @opennextjs/cloudflare@latest build --skipBuild
Build output directory: apps/web/.worker-next
Root directory: /
```

**IMPORTANTE**: Agora que temos o `open-next.config.ts` configurado, o comando deve incluir `build --skipBuild` no final.

### 3. Retry Deployment

Após configurar as variáveis:
1. Ir em **Deployments**
2. Clicar no último deployment (0366f40)
3. Clicar em **"Retry deployment"**

Ou fazer novo commit e push:
```bash
git commit --allow-empty -m "chore: Trigger rebuild com variáveis configuradas"
git push origin main
```

---

## 📋 COMANDOS CLI ÚTEIS

### Verificar Deployments
```bash
cd apps/web
npx wrangler pages deployment list --project-name=fitness-pro
```

### Verificar Projeto
```bash
npx wrangler pages project list
```

### Logs (quando deployment estiver rodando)
```bash
# Não disponível via CLI, use dashboard:
# https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro
```

---

## 🎯 PRÓXIMOS PASSOS (APÓS CORRIGIR ERRO 522)

### 1. Configurar Domínio Customizado via CLI

Quando o deployment estiver funcionando:

```bash
# Verificar domínios atuais
npx wrangler pages project list | grep fitness-pro

# Adicionar domínio customizado
# (Cloudflare Pages não suporta via CLI, precisa ser via dashboard)
```

**Via Dashboard**:
- https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/domains
- Adicionar: `fitpro.vip`
- Adicionar: `www.fitpro.vip`

### 2. Testar Aplicação

```bash
# Health check
curl -I https://fitpro.vip

# API
curl https://api.fitpro.vip/health

# Verificar service worker
curl -I https://fitpro.vip/sw.js
```

### 3. Validação Completa

```bash
# Frontend carrega
curl https://fitpro.vip | grep "<title>"

# PWA manifest
curl https://fitpro.vip/manifest.json

# Static assets
curl -I https://fitpro.vip/icon.svg
```

---

## 🐛 TROUBLESHOOTING

### Erro 522 persiste após configurar variáveis
1. Verificar logs do build no dashboard
2. Checar se `@opennextjs/cloudflare` buildou corretamente
3. Verificar se `.worker-next` foi gerado
4. Testar localmente com `npx wrangler pages dev`

### Build falha com "pnpm: command not found"
Adicionar variável de ambiente:
```
ENABLE_PNPM = 1
```

### Deployment fica em "Building" por muito tempo
Timeout pode ser issue com build command. Simplificar para:
```bash
cd apps/web && pnpm install && pnpm build
```

E fazer upload manual do `.worker-next`:
```bash
cd apps/web
npx wrangler pages deploy .worker-next --project-name=fitness-pro
```

---

## 📊 RESUMO DO STATUS ATUAL

```
├─ Git Repository ✅
│  ├─ Commits pushed ✅
│  └─ GitHub Actions N/A
│
├─ Cloudflare Pages ⚠️
│  ├─ Projeto criado ✅
│  ├─ Build completou ✅
│  ├─ Deployment Active ✅
│  ├─ Worker respondendo ❌ (522)
│  ├─ Variáveis ambiente ❌ (não configuradas)
│  └─ Domínio customizado ❌ (não configurado)
│
├─ Configuração ✅
│  ├─ next.config.ts ✅
│  ├─ open-next.config.ts ✅
│  ├─ wrangler.toml ✅
│  └─ package.json ✅
│
└─ Pendências ⏳
   ├─ Configurar env vars via dashboard
   ├─ Atualizar build command
   ├─ Retry deployment
   └─ Configurar domínio customizado
```

---

**Status**: ⚠️ Deployment ativo mas com erro 522 - Precisa configurar variáveis de ambiente

**Próxima Ação**: Acessar dashboard e configurar environment variables
