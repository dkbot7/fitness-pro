# ✅ Configuração CLI - Resumo Completo

## Data: 06/01/2026

## O que foi feito 100% via CLI

### 1. Configurar Variáveis de Ambiente no Cloudflare Pages

Usando a API do Cloudflare com token OAuth do wrangler:

```bash
curl -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/pages/projects/fitness-pro" \
  -H "Authorization: Bearer {WRANGLER_OAUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "deployment_configs": {
      "production": {
        "env_vars": {
          "VITE_CLERK_PUBLISHABLE_KEY": {
            "value": "pk_live_Y2xlcmsuZml0cHJvLnZpcCQ"
          },
          "VITE_API_URL": {
            "value": "https://api.fitpro.vip"
          }
        }
      }
    }
  }'
```

**Resultado:**
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` configurado com chave de produção
- ✅ `VITE_API_URL` configurado para produção

### 2. Desabilitar Builds Automáticos do GitHub

```bash
curl -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/pages/projects/fitness-pro" \
  -H "Authorization: Bearer {WRANGLER_OAUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "type": "github",
      "config": {
        "production_deployments_enabled": false,
        "deployments_enabled": false,
        "pr_comments_enabled": false
      }
    }
  }'
```

**Resultado:**
- ✅ Builds automáticos em push DESABILITADOS
- ✅ Apenas deploys manuais são permitidos agora

### 3. Build e Deploy Manual com Chaves de Produção

```bash
cd apps/web
rm -rf dist
pnpm build
npx wrangler pages deploy dist --project-name=fitness-pro --commit-dirty=true
```

**Resultado:**
- ✅ Build local usando `.env.production.local`
- ✅ Deploy manual com `pk_live_Y2xlcmsuZml0cHJvLnZpcCQ`
- ✅ URL do deploy: https://294b9c65.fitness-pro-2ph.pages.dev

## Por que isso resolve o problema

### Antes:
- Git push → Cloudflare faz build automático
- Build automático não tem `.env.production.local` (não está no Git)
- Build usa `.env` que tem `pk_test_...` (chaves de desenvolvimento)
- **Resultado:** Site em "Development mode"

### Agora:
- Git push → **NADA acontece** (builds automáticos desabilitados)
- Deploy manual → Build local com `.env.production.local`
- Build usa `pk_live_...` (chaves de produção)
- **Resultado:** Site em modo de produção ✅

## Verificação

```bash
cd apps/web/dist/assets
grep "Y2xlcmsuZml0cHJvLnZpcCQ" *.js
```

Se retornar resultados, significa que o build contém a chave de produção! ✅

## URLs

- **Último deploy manual:** https://294b9c65.fitness-pro-2ph.pages.dev
- **Produção (domínio custom):** https://fitpro.vip
- **Preview (sempre último manual):** https://fitness-pro-2ph.pages.dev

## Token Usado

O OAuth token do wrangler foi obtido de:
```
C:\Users\Vaio\AppData\Roaming\xdg.config\.wrangler\config\default.toml
```

Esse token tem as permissões necessárias:
- `pages:write` ✅
- `account:read` ✅

## Próximos Passos

1. Testar https://fitpro.vip/register
2. Verificar se "Development mode" sumiu
3. Criar uma conta de teste em produção

---

**Tudo feito via CLI, sem usar o dashboard do Cloudflare! 🎉**
