# [SETTINGS] Configurar Variáveis de Ambiente - Cloudflare Pages

## 🎯 Passo a Passo Simplificado

### 1️⃣ Abrir Settings do Projeto

**Clique neste link**:
```
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/environment-variables
```

Ou navegue manualmente:
- Dashboard Cloudflare → Pages → fitness-pro → Settings → Environment Variables

---

### 2️⃣ Adicionar as 7 Variáveis (Production)

Para cada variável abaixo:
1. Clique em **"Add variable"**
2. Selecione **"Production"** (Production and Preview ou só Production)
3. Cole o **Variable name** e **Value**
4. Clique em **"Save"**

---

#### Variável 1: NODE_VERSION
```
Variable name: NODE_VERSION
Value: 20
Environment: Production ✓
```

#### Variável 2: NEXT_PUBLIC_API_URL
```
Variable name: NEXT_PUBLIC_API_URL
Value: https://api.fitpro.vip
Environment: Production ✓
```

#### Variável 3: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```
Variable name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM
Environment: Production ✓
```

#### Variável 4: NEXT_PUBLIC_CLERK_SIGN_IN_URL
```
Variable name: NEXT_PUBLIC_CLERK_SIGN_IN_URL
Value: /login
Environment: Production ✓
```

#### Variável 5: NEXT_PUBLIC_CLERK_SIGN_UP_URL
```
Variable name: NEXT_PUBLIC_CLERK_SIGN_UP_URL
Value: /register
Environment: Production ✓
```

#### Variável 6: NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
```
Variable name: NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
Value: /
Environment: Production ✓
```

#### Variável 7: NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
```
Variable name: NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
Value: /onboarding
Environment: Production ✓
```

---

### 3️⃣ Verificar se todas foram adicionadas

Após adicionar todas, você deve ver **7 variáveis** na lista:

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

### 4️⃣ Triggerar Novo Deployment

**Opção A - Via CLI** (recomendado):
```bash
git commit --allow-empty -m "chore: Trigger rebuild with env vars"
git push origin main
```

**Opção B - Via Dashboard**:
1. Ir em **Deployments**
2. Clicar no último deployment
3. Clicar em **"Retry deployment"**

---

## ⏱️ Após Deployment

Aguarde ~5-10 minutos para o build completar.

Depois teste:
```bash
# Via CLI
curl -I https://750be74f.fitness-pro-2ph.pages.dev
# ou
curl -I https://fitness-pro-2ph.pages.dev
```

Deve retornar **200 OK** ao invés de **522**.

---

## 🔍 Verificar se as Variáveis Estão Funcionando

Quando o site carregar, abra DevTools (F12) → Console e digite:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Deve retornar: `"https://api.fitpro.vip"`

---

## ❓ Troubleshooting

### Variável não aparece depois de adicionar
- Recarregue a página do dashboard
- Verifique se clicou em "Save"

### Deployment continua dando erro 522
- Verifique se selecionou "Production" environment
- Certifique-se que todas as 7 variáveis foram adicionadas
- Faça retry do deployment após adicionar

### Build falha após adicionar variáveis
- Verifique se não há erros de digitação nos valores
- Confirme que a chave do Clerk está correta

---

## [OK] Checklist

Antes de fazer o deployment:
- [ ] NODE_VERSION = 20
- [ ] NEXT_PUBLIC_API_URL = https://api.fitpro.vip
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
- [ ] NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login
- [ ] NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding
- [ ] Todas selecionadas para "Production"
- [ ] Clicou em "Save" em cada uma

---

**Pronto!** Depois que configurar, me avise que eu faço o deployment via CLI.
