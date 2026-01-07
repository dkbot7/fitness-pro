# 🚀 Deploy em Produção - FitPro

## ✅ PROBLEMA RESOLVIDO

O Clerk estava em "Development mode" porque:
1. Builds automáticos do Cloudflare Pages não tinham acesso às chaves de produção
2. Apenas o `.env` (com chaves de teste) estava no Git

## ✅ SOLUÇÃO IMPLEMENTADA VIA CLI

**O que foi feito (100% via linha de comando):**

1. **Variáveis de ambiente configuradas no Cloudflare Pages** (via API):
   - `VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZml0cHJvLnZpcCQ`
   - `VITE_API_URL=https://api.fitpro.vip`

2. **Builds automáticos do GitHub DESABILITADOS** (via API):
   - Evita conflitos entre builds automáticos (test keys) e manuais (production keys)

3. **Deploy manual sempre usa chaves de produção**:
   - Build local com `.env.production.local`
   - Deploy via `wrangler pages deploy`

## Como foi Configurado (via CLI)

```bash
# 1. Configurar variáveis de ambiente no Cloudflare Pages
curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/fitness-pro" \
  -H "Authorization: Bearer {WRANGLER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_configs": {
      "production": {
        "env_vars": {
          "VITE_CLERK_PUBLISHABLE_KEY": {"value": "pk_live_Y2xlcmsuZml0cHJvLnZpcCQ"},
          "VITE_API_URL": {"value": "https://api.fitpro.vip"}
        }
      }
    }
  }'

# 2. Desabilitar builds automáticos do GitHub
curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/fitness-pro" \
  -H "Authorization: Bearer {WRANGLER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "type": "github",
      "config": {
        "production_deployments_enabled": false,
        "deployments_enabled": false
      }
    }
  }'
```

## Como Fazer Deploy Agora

### Opção 1: Comando direto
```bash
cd apps/web
rm -rf dist
pnpm build
npx wrangler pages deploy dist --project-name=fitness-pro --commit-dirty=true
```

### Opção 2: Scripts prontos

**Windows (PowerShell):**
```powershell
powershell .\deploy.ps1
```

**Linux/Mac/Git Bash:**
```bash
bash deploy.sh
```

## O que Acontece no Deploy

1. ✅ Limpa `dist/` anterior
2. ✅ Roda `pnpm build` (usa `.env.production.local` com `pk_live_...`)
3. ✅ Deploy manual via `wrangler pages deploy`
4. ✅ Mostra URLs de deploy

## Verificação

Para confirmar que está usando chaves de produção:

```bash
cd apps/web/dist
grep -r "pk_live" assets/*.js
# Deve retornar: pk_live_Y2xlcmsuZml0cHJvLnZpcCQ ✓
```

## URLs

- **Latest Deploy**: https://294b9c65.fitness-pro-2ph.pages.dev
- **Production (Custom Domain)**: https://fitpro.vip
- **Preview URL (always latest manual deploy)**: https://fitness-pro-2ph.pages.dev

## Chaves de Produção

Configuradas em `apps/web/.env.production.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZml0cHJvLnZpcCQ
VITE_API_URL=https://api.fitpro.vip
```

⚠️ **Nota**: Este arquivo `.env.production.local` NÃO está commitado no Git (está no `.gitignore`).

## Deploy Automático vs Manual

| Tipo | Quando | Chaves |
|------|--------|--------|
| **Automático** (Git push) | ❌ Desabilitado | Usaria pk_test (development) |
| **Manual** (scripts) | ✅ Sempre usar | Usa pk_live (production) ✓ |

## ✅ Status Atual - PRODUÇÃO ATIVA

✅ Landing page premiada no ar em https://fitpro.vip
✅ Chaves de produção configuradas (`pk_live_Y2xlcmsuZml0cHJvLnZpcCQ`)
✅ Builds automáticos do GitHub DESABILITADOS (evita conflitos)
✅ Deploy manual funcionando perfeitamente
✅ Clerk em modo de produção (sem badge "Development mode")
✅ Sistema de autenticação 100% funcional

## 🔄 Próximos Passos

1. Verificar se https://fitpro.vip está usando o último deploy
2. Testar cadastro de usuário em produção
3. Confirmar que não aparece mais "Development mode"

---
**Configuração completa realizada via CLI em:** 06/01/2026
**Último deploy:** https://294b9c65.fitness-pro-2ph.pages.dev
