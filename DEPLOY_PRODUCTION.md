# 🚀 Deploy em Produção - FitPro

## Problema Resolvido

O Cloudflare Pages, ao fazer build automático via Git, não tem acesso às chaves de produção do Clerk (`pk_live_...`). Por isso, o site ficava em "Development mode".

## Solução

Criamos scripts de deploy que **sempre usam chaves de produção**:

1. Build **local** com `.env.production.local` (contém `pk_live_...`)
2. Deploy **manual** para Cloudflare Pages
3. Resultado: Site 100% em modo produção

## Como Fazer Deploy

### Windows (PowerShell)
```powershell
powershell .\deploy.ps1
```

### Linux/Mac/Git Bash
```bash
bash deploy.sh
```

## O que o Script Faz

1. ✅ Limpa `dist/` anterior
2. ✅ Roda `pnpm build` (usa chaves de produção locais)
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

- **Latest Deploy**: https://fitness-pro-2ph.pages.dev
- **Production**: https://fitpro.vip

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

## Status Atual

✅ Landing page premiada no ar
✅ Chaves de produção ativas
✅ "Development mode" removido
✅ Deploy funcional em https://fitpro.vip

---
Última atualização: 06/01/2026
