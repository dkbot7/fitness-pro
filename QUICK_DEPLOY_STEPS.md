# 🚀 Deploy Rápido - 3 Cliques

## ✅ JÁ ESTÁ PRONTO:
- ✅ Projeto Pages criado: `fitness-pro`
- ✅ Repositório GitHub: https://github.com/dkbot7/fitness-pro
- ✅ Código commitado e pushed

---

## 👆 FAÇA APENAS ISTO (3 cliques):

### 1. Abrir Settings do Projeto
Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings

### 2. Conectar ao GitHub
Na seção **"Build configuration"**, clique em **"Connect to GitHub"** ou **"Add build configuration"**

### 3. Selecionar Repositório
- **GitHub repository**: `dkbot7/fitness-pro`
- **Production branch**: `main`

### 4. Configurar Build (copie e cole):

**Framework preset**: `Next.js`

**Build command**:
```
pnpm install --frozen-lockfile && cd apps/web && pnpm build && npx @opennextjs/cloudflare@latest
```

**Build output directory**:
```
apps/web/.worker-next
```

**Root directory**:
```
/
```

### 5. Adicionar Variáveis de Ambiente

Clique em **"Environment variables"** e adicione:

```
NODE_VERSION = 20
NEXT_PUBLIC_API_URL = https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
```

### 6. Salvar e Deploy

Clique em **"Save"** no final da página.

O Cloudflare vai automaticamente:
1. Fazer pull do repositório
2. Rodar o build (5-10 min)
3. Deploy automático

---

## 🔔 DEPOIS DO BUILD:

Quando terminar, você vai ter:
- ✅ https://fitness-pro-2ph.pages.dev (URL temporária)
- ⏳ https://fitpro.vip (depois de configurar domínio customizado)

---

## 📱 CONFIGURAR DOMÍNIO CUSTOMIZADO (depois do deploy):

1. Ir em: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/domains
2. Clicar em **"Set up a custom domain"**
3. Digite: `fitpro.vip`
4. Clicar em **"Continue"**
5. Repetir para `www.fitpro.vip`

Cloudflare configura DNS automaticamente!

---

**Link direto para começar**:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

**Tempo total**: ~2 minutos de configuração + 5-10 min de build automático
