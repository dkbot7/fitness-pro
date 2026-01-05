# 🚀 Deploy Definitivo - Configuração Simplificada

## ✅ Mudanças Aplicadas

1. ✅ Removido `output: 'standalone'` do next.config.ts
2. ✅ Adicionado `images: { unoptimized: true }` (necessário para Cloudflare)
3. ✅ Configuração simplificada sem OpenNext
4. ✅ PWA mantido funcionando

---

## ⚙️ CONFIGURAÇÃO DEFINITIVA (Cloudflare Pages Dashboard)

### 📍 Build Settings

**Acesse**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

**Configure exatamente assim**:

#### Framework preset
```
Next.js
```

#### Build command
```bash
cd apps/web && pnpm install --frozen-lockfile && pnpm build
```

#### Build output directory
```
apps/web/.next
```

#### Root directory (deixar vazio)
```

```

#### Environment variables (Production)
Devem estar configuradas (7 variáveis):
```
NODE_VERSION = 20
NEXT_PUBLIC_API_URL = https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_bmF0aXZlLWhpcHBvLTE0LmNsZXJrLmFjY291bnRzLmRldiQ
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
```

---

## 🔄 Esta é a Configuração Mais Simples e Estável

**Por que vai funcionar**:
- ✅ Usa preset Next.js nativo do Cloudflare
- ✅ Sem adapters complexos (OpenNext, etc)
- ✅ Next.js 15 tem suporte nativo para edge runtime
- ✅ Cloudflare Pages reconhece `.next` automaticamente
- ✅ Images unoptimized (Cloudflare não suporta next/image otimizado)

**O que o Cloudflare faz automaticamente**:
1. Detecta que é Next.js
2. Converte rotas para Workers
3. Faz deploy das páginas estáticas
4. Configura Edge Functions automaticamente

---

## 📋 Passos para Aplicar

### PASSO 1: Atualizar Build Settings (Dashboard)
1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds
2. Altere **Build command** para: `cd apps/web && pnpm install --frozen-lockfile && pnpm build`
3. Altere **Build output directory** para: `apps/web/.next`
4. Clique em **Save**

### PASSO 2: Fazer Deploy (Via CLI - Faço Eu)
```bash
git add .
git commit -m "fix: Simplificar configuração Next.js para Cloudflare Pages"
git push origin main
```

### PASSO 3: Aguardar Build (~5-10 min)
Monitor via:
```bash
cd apps/web && npx wrangler pages deployment list --project-name=fitness-pro
```

---

## ✅ Após Build Completar

Teste:
```bash
curl -I https://fitness-pro-2ph.pages.dev
```

Deve retornar **200 OK** ou **30x redirect** (não 404, não 522)!

---

## 🎯 Próximo Passo: Domínio Customizado

Quando estiver funcionando, configurar:
1. **Acesse**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/domains
2. Adicionar: `fitpro.vip`
3. Adicionar: `www.fitpro.vip`

---

## 📊 Resumo

```
┌─────────────────────────────────┐
│ CONFIGURAÇÃO DEFINITIVA         │
├─────────────────────────────────┤
│ Framework: Next.js (preset)     │
│ Build: pnpm build               │
│ Output: .next (nativo)          │
│ Adapter: Nenhum (CF nativo)     │
│ Images: unoptimized             │
│ Standalone: Não                 │
└─────────────────────────────────┘
```

Esta é a configuração **mais simples, estável e suportada** pelo Cloudflare Pages para Next.js.

---

**Pronto para deploy?** Me avise que eu faço o commit e push! 🚀
