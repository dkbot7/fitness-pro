# 🔑 Atualização Chaves Clerk - 10/01/2026

## 🐛 Problema Resolvido

### Erro:
```
500 Internal Server Error
ClerkAPIResponseError: Unauthorized
```

### Causa Raiz:
O código estava usando chaves de **TESTE** do Clerk, mas a aplicação em produção precisa das chaves de **PRODUÇÃO**.

**Chaves antigas (ERRADAS):**
- Frontend: `pk_test_...` (de ambiente de teste)
- Backend: `sk_test_...` (de ambiente de teste)

**Chaves novas (CORRETAS):**
- Frontend: `pk_live_...` (de produção - obtida do Clerk Dashboard)
- Backend: `sk_live_...` (de produção - configurada via Wrangler secret)

---

## ✅ Mudanças Realizadas

### 1. Backend (Cloudflare Workers Secret)
```bash
cd apps/api
echo "YOUR_CLERK_SECRET_KEY" | npx wrangler secret put CLERK_SECRET_KEY
```

**Nota:** Use a secret key `sk_live_...` obtida do Clerk Dashboard.

**Resultado:**
```
✨ Success! Uploaded secret CLERK_SECRET_KEY
```

### 2. Frontend (.env)
**Arquivo:** `apps/web/.env`

**Antes:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Depois:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

**Nota:** Use a publishable key `pk_live_...` obtida do Clerk Dashboard.

### 3. Rebuild e Deploy Frontend
```bash
cd apps/web
pnpm build
pnpm cf-deploy
```

**Resultado:**
```
✨ Deployment complete!
URL: https://d7c50e4b.fitness-pro-2ph.pages.dev
Production: https://fitpro.vip
```

---

## 🔍 Verificação das Chaves

### Clerk Dashboard (clerk.fitpro.vip):

**Publishable Key:**
- Tipo: Production
- Formato: `pk_live_...`
- Uso: Frontend (público, pode ser exposto)

**Secret Key:**
- Tipo: Production
- Formato: `sk_live_...`
- Uso: Backend (privado, nunca expor)

**JWKS URL:**
- `https://clerk.fitpro.vip/.well-known/jwks.json`

**Frontend API URL:**
- `https://clerk.fitpro.vip`

---

## 🎯 Como Funciona

### Fluxo de Autenticação:

1. **Frontend (fitpro.vip):**
   - Usa `pk_live_...` (Publishable Key)
   - Clerk autentica usuário
   - Gera JWT token assinado

2. **Backend (api.fitpro.vip):**
   - Recebe JWT token do frontend
   - Valida assinatura usando JWKS
   - Extrai `userId` do token

3. **Busca de Dados (quando necessário):**
   - Backend usa `sk_live_...` (Secret Key)
   - Chama Clerk API: `clerkClient.users.getUser(userId)`
   - Obtém email e outros dados do usuário

### Por que precisamos da Secret Key?

O JWT do Clerk por padrão não inclui o email do usuário (por questões de privacidade e tamanho do token). Quando precisamos do email (como no onboarding), fazemos uma chamada à API do Clerk usando a Secret Key.

---

## 🧪 Como Testar

### 1. Limpe o cache do navegador:
```
Ctrl + Shift + Delete
Limpar cookies e cache
```

### 2. Acesse o site:
```
https://fitpro.vip
```

### 3. Faça login novamente:
- O login gerará um novo JWT com as chaves de produção
- O token será válido para a API de produção

### 4. Complete o onboarding:
- Selecione seu objetivo
- Escolha frequência e local
- Selecione equipamentos disponíveis
- Envie o formulário

### Resultado Esperado:
- ✅ Sem erros 401 ou 500
- ✅ Toast de sucesso
- ✅ Redirecionamento para /plano
- ✅ Treino gerado com sucesso

---

## 📊 Diferenças Test vs Live

### Test Keys (sk_test_... / pk_test_...):
- ✅ Para desenvolvimento local
- ✅ Para ambientes de staging/teste
- ✅ Dados de teste separados
- ❌ Não funcionam em produção

### Live Keys (sk_live_... / pk_live_...):
- ✅ Para produção
- ✅ Dados reais de usuários
- ✅ Funcionam com domínio custom (clerk.fitpro.vip)
- ⚠️ Devem ser mantidas seguras

---

## ⚠️ Segurança

### Secret Key (sk_live_...):
- ❌ **NUNCA** commitar no git
- ❌ **NUNCA** expor no frontend
- ❌ **NUNCA** compartilhar publicamente
- ✅ Armazenar em Cloudflare Workers Secrets
- ✅ Armazenar em .dev.vars local (não commitado)

### Publishable Key (pk_live_...):
- ✅ Pode ser exposta no frontend
- ✅ Pode ser commitada no .env (se necessário)
- ✅ Segura para ser pública

---

## 📝 Checklist de Deploy

- [x] Secret Key atualizada no Worker
- [x] Publishable Key atualizada no .env
- [x] Frontend rebuilded
- [x] Frontend deployado
- [x] Cache do navegador limpo
- [ ] Teste de onboarding completo
- [ ] Verificar logs do Worker
- [ ] Confirmar que não há mais erros 401/500

---

## 🔧 Troubleshooting

### Se ainda der erro após as mudanças:

1. **Limpe TOTALMENTE o cache:**
   ```
   - Cookies do clerk.fitpro.vip
   - Cookies do fitpro.vip
   - LocalStorage
   - SessionStorage
   ```

2. **Faça logout e login novamente:**
   - Isso força a geração de um novo token
   - O novo token usará as chaves de produção

3. **Verifique os logs do Worker:**
   ```bash
   cd apps/api
   npx wrangler tail --format=pretty
   ```

4. **Verifique se a secret está correta:**
   ```bash
   npx wrangler secret list
   # Deve mostrar: CLERK_SECRET_KEY
   ```

### Comandos úteis:

**Ver secrets configuradas:**
```bash
cd apps/api
npx wrangler secret list
```

**Atualizar secret:**
```bash
echo "NOVA_SECRET_KEY" | npx wrangler secret put CLERK_SECRET_KEY
```

**Deletar secret:**
```bash
npx wrangler secret delete CLERK_SECRET_KEY
```

---

## 📚 Documentação de Referência

### Clerk:
- [Clerk Dashboard](https://dashboard.clerk.com)
- [API Keys](https://dashboard.clerk.com/apps/app_xxx/instances/ins_xxx/api-keys)
- [Backend SDK](https://clerk.com/docs/references/backend/overview)

### Cloudflare:
- [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Data:** 10/01/2026
**Hora:** ~21:45 BRT
**Status:** ✅ **CHAVES ATUALIZADAS E DEPLOYADAS**

🎉 **Agora teste o onboarding novamente!**

---

## 🔄 Próximos Passos

1. **Teste o onboarding**
2. **Se funcionar:** Documentar sucesso
3. **Se ainda falhar:** Verificar logs e investigar mais

**Aguardando seu teste...** 🚀
