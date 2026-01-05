# Deploy do Frontend fitpro.vip - Via Dashboard

## ⚠️ Problema com OpenNext no Windows

O OpenNext requer permissões especiais para criar symlinks no Windows. A solução mais fácil é fazer deploy via Cloudflare Pages Dashboard conectando ao GitHub.

---

## 🚀 Método 1: Deploy via Dashboard (RECOMENDADO)

### **Passo 1: Fazer commit e push do código**

```bash
# Na raiz do projeto
git status
git add .
git commit -m "feat: Preparar para deploy em produção"
git push origin main
```

### **Passo 2: Conectar repositório ao Cloudflare Pages**

1. Acesse: https://dash.cloudflare.com/pages
2. Clique em **"Create a project"**
3. Clique em **"Connect to Git"**
4. Selecione **GitHub**
5. Autorize o Cloudflare a acessar seu repositório
6. Selecione o repositório do projeto
7. Configure o build:

**Framework preset**: `Next.js`

**Build command**:
```
pnpm install && cd apps/web && pnpm build && npx @opennextjs/cloudflare
```

**Build output directory**:
```
apps/web/.worker-next
```

**Root directory (Project root path)**:
```
/ (deixar vazio ou raiz)
```

**Environment variables** (clique em "Add variable"):
```
NODE_VERSION = 20
NEXT_PUBLIC_API_URL = https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
```

8. Clique em **"Save and Deploy"**

### **Passo 3: Aguardar build (5-10 minutos)**

O Cloudflare vai:
- Clonar seu repositório
- Instalar dependências
- Buildar Next.js
- Converter com OpenNext (funciona no Linux)
- Deploy automático

Você verá o progresso em tempo real no dashboard.

### **Passo 4: Configurar domínio customizado**

Após o deploy bem-sucedido:

1. No dashboard do projeto, vá em **"Custom domains"**
2. Clique **"Set up a custom domain"**
3. Digite: `fitpro.vip`
4. Clique **"Continue"** e **"Activate domain"**
5. Repita para `www.fitpro.vip`

O Cloudflare vai configurar automaticamente os registros DNS.

---

## 🔧 Método 2: Deploy via CLI (Alternativa - WSL)

Se você tiver WSL instalado, pode fazer via CLI:

```bash
# No WSL (Ubuntu/Debian)
cd /mnt/c/fitness_pro
cd apps/web

# Build e deploy
npx @opennextjs/cloudflare
npx wrangler pages deploy .worker-next --project-name=fitness-pro
```

---

## 🔧 Método 3: Deploy via CLI Windows (Se resolver permissões)

Execute PowerShell **como Administrador** e habilite symlinks:

```powershell
# PowerShell como Administrador
Enable-LocalPolicy -Policy SeCreateSymbolicLinkPrivilege -UserName $env:USERNAME
```

Depois:

```bash
cd apps/web
npx @opennextjs/cloudflare
npx wrangler pages deploy .worker-next --project-name=fitness-pro
```

---

## ✅ Verificar Deploy

Após o deploy:

```bash
# Testar URL temporária do Cloudflare Pages
curl -I https://fitness-pro.pages.dev

# Testar domínio customizado (após configurar)
curl -I https://fitpro.vip
curl -I https://www.fitpro.vip

# Testar API
curl https://api.fitpro.vip/health
```

---

## 📋 Variáveis de Ambiente de Produção

**IMPORTANTE**: Depois do deploy inicial, você pode:

1. Ir em Pages > fitness-pro > Settings > Environment variables
2. Trocar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` para chave de produção (`pk_live_...`)
3. Trocar `NEXT_PUBLIC_API_URL` se necessário

Depois fazer um novo deploy para aplicar as mudanças.

---

## 🔄 Próximos Deploys

Após configurar via dashboard, todo `git push` para a branch `main` vai fazer deploy automático!

```bash
git add .
git commit -m "feat: Nova feature"
git push origin main
# Deploy automático acontece!
```

---

**Última atualização**: 05/01/2026
**Método recomendado**: Deploy via Dashboard (Método 1)
