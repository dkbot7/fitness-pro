# 🎯 ÚLTIMO PASSO - Build Settings

## ✅ Status

- ✅ Variáveis de ambiente configuradas (screenshot confirmado)
- ✅ Código no GitHub
- ✅ Deploy manual funcionou
- ⏳ **Falta:** Corrigir Build Settings + Retry

---

## 🔧 PASSO ÚNICO: Build Settings (1 minuto)

### 1. Acesse Build Settings:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

### 2. Clique no menu "Build" (lado esquerdo) e configure:

**Framework preset:**
```
None
```
(ou selecione "Vite" se aparecer na lista)

**Build command:**
```
pnpm install --frozen-lockfile && cd apps/web && pnpm build
```

**Build output directory:**
```
apps/web/dist
```

**Root directory (Path):**
```
(deixe vazio)
```

### 3. Clique em "Save"

---

## 🔄 Retry do Build

### Após salvar as configurações:

1. Vá para: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/deployments

2. Encontre o deployment com commit **"feat: Migrate from Next.js to Vite + React Router"** (899f9e7)

3. Clique nos **três pontinhos** (...) no canto direito

4. Clique em **"Retry deployment"**

5. Aguarde ~1-2 minutos

---

## ✅ Verificar Sucesso

O build deve:
- ✅ Executar: `pnpm install --frozen-lockfile` (instala workspace)
- ✅ Executar: `cd apps/web` (entra no diretório)
- ✅ Executar: `pnpm build` (build Vite)
- ✅ Usar variáveis de ambiente já configuradas
- ✅ Deploy para: `apps/web/dist`
- ✅ Status: **Active** (não mais Failure)

**Quando status = Active:**
- Acesse: https://fitness-pro-2ph.pages.dev
- Teste login, onboarding, treinos, etc.
- ✅ **PROJETO EM PRODUÇÃO!**

---

## 📊 O que mudou?

### Antes (Next.js - não funcionava):
```bash
Build: cd apps/web && npm install && npm build && npx @opennextjs/cloudflare
Output: apps/web/.next
Status: 404 errors
```

### Depois (Vite - funcionando):
```bash
Build: pnpm install --frozen-lockfile && cd apps/web && pnpm build
Output: apps/web/dist
Status: ✅ Funcionando
```

---

## 🎉 Após isso estar funcionando:

### Próximos pushes serão automáticos:
```bash
git add .
git commit -m "alguma mudança"
git push origin main
```
→ Build automático no Cloudflare Pages
→ Deploy em ~1-2 minutos
→ Site atualizado automaticamente

### Domínio custom (opcional):
Se quiser configurar fitpro.vip:
1. Acesse: https://dash.cloudflare.com/pages/view/fitness-pro/settings/domains
2. Adicione custom domain: `fitpro.vip`
3. Aguarde propagação DNS

---

## 🔍 Se o build falhar novamente:

Clique no deployment que falhou → Role até "Build log" → Veja o erro exato.

**Possíveis problemas:**

### "Command not found: pnpm"
→ Cloudflare Pages deve ter pnpm instalado por padrão
→ Se não tiver, mude para: `npm install && cd apps/web && npm run build`

### "Cannot find module '@fitness-pro/shared'"
→ Certifique-se que o build command começa com `pnpm install --frozen-lockfile`
→ Isso instala as dependências do workspace

### "Module not found: vite"
→ Certifique-se que o build command tem `cd apps/web && pnpm build`
→ O pnpm build só funciona depois de entrar no diretório

---

**É só isso! Após corrigir o Build Settings e fazer retry, o site estará em produção. 🚀**
