# ✅ Projeto Recriado - Próximos Passos

## Status

✅ **Projeto Deletado**: fitness-pro (antigo)
✅ **Projeto Criado**: fitness-pro (novo, limpo)
✅ **URL**: https://fitness-pro-2ph.pages.dev

---

## 🔗 Conectar ao GitHub (VIA DASHBOARD)

Infelizmente o Wrangler CLI **não suporta** conectar ao GitHub. Precisa ser via dashboard.

### 1️⃣ Acesse o Projeto
```
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro
```

### 2️⃣ Conectar ao Git

1. Clique em **"Settings"** (menu lateral)
2. Vá em **"Builds & deployments"**
3. Na seção **"Source"**, clique em **"Connect to Git"**
4. Selecione **"GitHub"**
5. Escolha o repositório: **`dkbot7/fitness-pro`**
6. Production branch: **`main`**

### 3️⃣ Configurar Build Settings

**Framework preset**: `Next.js`

**Build command**:
```bash
pnpm install --frozen-lockfile && cd apps/web && pnpm build && npx @opennextjs/cloudflare@latest build --skipBuild
```

**Build output directory**:
```
apps/web/.worker-next
```

**Root directory**:
```
/
```

### 4️⃣ Adicionar Environment Variables (Production)

Clique em **"Add variable"** para cada uma:

```env
NODE_VERSION=20
NEXT_PUBLIC_API_URL=https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bmF0aXZlLWhpcHBvLTE0LmNsZXJrLmFjY291bnRzLmRldiQ
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 5️⃣ Salvar e Deploy

Clique em **"Save and Deploy"**

O Cloudflare vai:
1. Conectar ao GitHub ✅
2. Fazer pull do código ✅
3. Rodar build no ambiente Linux ✅
4. Deploy automático ✅

---

## ⏱️ Aguarde ~5-10 minutos

Depois teste:
```bash
curl -I https://fitness-pro-2ph.pages.dev
```

Deve retornar **200 OK**! 🎉

---

## 🎯 Alternativa: Deploy Manual (se quiser testar antes)

Se quiser fazer deploy manual de teste enquanto configura o GitHub:

```bash
# 1. Fazer build localmente (vai falhar no Windows mas gera arquivos parciais)
cd apps/web
pnpm build

# 2. Tentar gerar .worker-next (pode dar erro mas vale tentar)
npx @opennextjs/cloudflare@latest build --skipBuild

# 3. Se .worker-next for gerado, fazer deploy
npx wrangler pages deploy .worker-next --project-name=fitness-pro
```

**Mas recomendo** conectar ao GitHub via dashboard, que é mais confiável pois builda no Linux.

---

## 📊 Resumo das URLs

### Projeto
- Dashboard: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro
- Settings: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings

### Quando Deployar
- Frontend: https://fitness-pro-2ph.pages.dev
- API: https://api.fitpro.vip (já funcionando ✅)

---

## ✅ Checklist Final

- [ ] Acessou dashboard do projeto
- [ ] Conectou ao GitHub (dkbot7/fitness-pro)
- [ ] Configurou build command correto
- [ ] Adicionou 7 environment variables
- [ ] Clicou em "Save and Deploy"
- [ ] Aguardou build completar
- [ ] Testou https://fitness-pro-2ph.pages.dev
- [ ] Recebeu 200 OK
- [ ] Configurou domínio customizado fitpro.vip

---

**Próximo**: Me avise quando conectar ao GitHub que eu acompanho o deployment via CLI!
