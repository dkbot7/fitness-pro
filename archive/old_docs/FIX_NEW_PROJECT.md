# 🔧 Ajustar Novo Projeto fitness-pro

## [OK] Status Atual

- [OK] Projeto criado e conectado ao GitHub
- [OK] Deployment automático rodou
- [X] Deployment retorna 404 (build settings incorretos)

**URL Deployment**: https://8d386153.fitness-pro-2ph.pages.dev
**Status**: 404 Not Found

---

## 🎯 AJUSTES NECESSÁRIOS

### 1️⃣ Configurar Build Settings (CRÍTICO)

**Acesse**:
```
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds
```

**Configure assim**:

#### Framework preset
```
Next.js
```

#### Build command
```bash
pnpm install --frozen-lockfile && cd apps/web && pnpm build && npx @opennextjs/cloudflare@latest build --skipBuild
```

#### Build output directory
```
apps/web/.worker-next
```

#### Root directory
```
/
```

**IMPORTANTE**: Depois de salvar, clique em **"Retry deployment"** no último deployment.

---

### 2️⃣ Adicionar Environment Variables

**Acesse**:
```
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/environment-variables
```

**Adicione estas 7 variáveis** (Production):

```env
NODE_VERSION = 20
NEXT_PUBLIC_API_URL = https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_bmF0aXZlLWhpcHBvLTE0LmNsZXJrLmFjY291bnRzLmRldiQ
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
```

Para cada uma:
1. Clique em **"Add variable"**
2. Environment: **Production** ✓
3. Cole Name e Value
4. Clique em **"Save"**

---

### 3️⃣ Retry Deployment

Após configurar build settings e variáveis:

**Opção A - Via Dashboard**:
1. Ir em **Deployments**
2. Clicar no deployment mais recente (8d386153)
3. Clicar em **"Retry deployment"**

**Opção B - Via CLI** (faço eu):
```bash
git commit --allow-empty -m "chore: Trigger rebuild with correct settings"
git push origin main
```

---

## 📋 Ordem Recomendada

1. **Primeiro**: Configurar Build Settings (passo 1)
2. **Segundo**: Adicionar Environment Variables (passo 2)
3. **Terceiro**: Retry deployment (passo 3)

Isso garante que o próximo build terá todas as configurações corretas.

---

## ⏱️ Após Retry

Aguarde ~5-10 minutos para build completar.

Depois teste:
```bash
curl -I https://fitness-pro-2ph.pages.dev
```

Deve retornar **200 OK** ao invés de 404! 🎉

---

## 🔍 Como Verificar se Está Configurado Corretamente

### Build Settings
Acesse: Settings → Builds & deployments

Deve mostrar:
```
✓ Framework preset: Next.js
✓ Build command: pnpm install --frozen-lockfile && cd apps/web...
✓ Build output directory: apps/web/.worker-next
✓ Root directory: /
```

### Environment Variables
Acesse: Settings → Environment Variables

Deve mostrar **7 variáveis** em Production:
```
✓ NODE_VERSION
✓ NEXT_PUBLIC_API_URL
✓ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
✓ NEXT_PUBLIC_CLERK_SIGN_IN_URL
✓ NEXT_PUBLIC_CLERK_SIGN_UP_URL
✓ NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
✓ NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
```

---

## [OK] Checklist de Configuração

- [ ] Build Settings configurados corretamente
  - [ ] Framework: Next.js
  - [ ] Build command correto (com OpenNext)
  - [ ] Output directory: apps/web/.worker-next
  - [ ] Root directory: /
- [ ] Environment Variables adicionadas (7 variáveis)
- [ ] Retry deployment triggerado
- [ ] Build completou com sucesso
- [ ] Site responde 200 OK

---

## 🆘 Se Precisar de Ajuda

**Links Diretos**:
- Build Settings: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds
- Environment Variables: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/environment-variables
- Deployments: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/deployments

**Dashboard Principal**:
- https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro

---

**Me avise quando configurar** que eu monitoro o próximo deployment via CLI! 🚀
