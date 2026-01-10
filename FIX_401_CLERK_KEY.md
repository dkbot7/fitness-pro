# 🔐 Fix 401 - Clerk Authentication

**Data:** 09/01/2026
**Status:** 🔍 Investigando erro 401 Unauthorized

---

## ✅ Progresso Feito

1. ✅ CSP corrigido - Conexão com backend funcionando
2. ✅ Frontend deployado com melhorias
3. ✅ Backend funcionando e saudável
4. ⚠️ **PROBLEMA ATUAL:** Erro 401 (Unauthorized)

---

## 🔍 Diagnóstico do Erro 401

### O que está acontecendo:
```
POST https://fitness-pro-api.chatbotimoveis.workers.dev/api/onboarding
Status: 401 Unauthorized
Error: "Missing or invalid Authorization header" OU "Invalid token"
```

### Possíveis Causas:

1. **Clerk Publishable Key incorreta ou incompleta**
   - A key atual: `pk_live_Y2xlcmsuZml0cHJvLnZpcCQ`
   - Pode estar truncada ou incorreta

2. **CLERK_SECRET_KEY no backend incorreto**
   - Precisa corresponder ao ambiente do publishable key

3. **Domínio customizado não configurado corretamente**
   - clerk.fitpro.vip pode não estar resolvendo

4. **Token JWT inválido**
   - Issuer (iss) não reconhecido
   - Token expirado

---

## 🔧 Solução Passo a Passo

### PASSO 1: Verificar Chave Publishable

1. **Acesse o Clerk Dashboard:**
   - https://dashboard.clerk.com/
   - Faça login

2. **Vá para API Keys:**
   - No menu lateral, clique em "API Keys"
   - Selecione o ambiente **Production**

3. **Copie a Publishable Key COMPLETA:**
   - Deve começar com: `pk_live_`
   - Exemplo: `pk_live_Y2xlcmsuZml0cHJvLnZpcCQ` (mas provavelmente mais longa)

4. **Verifique se está usando Custom Domain:**
   - Se estiver usando `clerk.fitpro.vip`
   - A publishable key será diferente
   - Procure por "Custom domain" ou "Development" keys

### PASSO 2: Atualizar Frontend

**Edite o arquivo:**
```
C:\fitness_pro\apps\web\.env.production
```

**Substitua a linha 2 pela chave COMPLETA:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_[COLE_A_CHAVE_COMPLETA_AQUI]
```

**IMPORTANTE:** Copie a chave INTEIRA do Clerk Dashboard!

### PASSO 3: Verificar Secret Key no Backend

1. **No Clerk Dashboard:**
   - Na mesma página de API Keys
   - Copie a **Secret Key** (começa com `sk_live_`)

2. **Atualizar no Cloudflare Workers:**
```bash
cd C:\fitness_pro\apps\api
npx wrangler secret put CLERK_SECRET_KEY
# Cole a secret key quando solicitado
```

### PASSO 4: Rebuild e Deploy

```bash
# Rebuild frontend
cd C:\fitness_pro\apps\web
npm run build

# Deploy frontend
npx wrangler pages deploy dist --project-name=fitness-pro

# Backend já tem a secret, mas se precisar redeployar:
cd C:\fitness_pro\apps\api
npx wrangler deploy
```

### PASSO 5: Testar com Ferramenta de Debug

**Abra o arquivo:**
```
C:\fitness_pro\test-auth-debug.html
```

Ou execute:
```bash
start C:\fitness_pro\test-auth-debug.html
```

**Siga os passos na ferramenta:**

1. **Verificar Clerk** - Confirma que você está logado
2. **Decodificar Token** - Mostra o conteúdo do JWT
3. **Testar Backend** - Testa autenticação no endpoint
4. **Testar Onboarding** - Envia dados completos

**O que procurar:**
- ✅ Token deve ter `iss` (issuer) válido
- ✅ Token NÃO deve estar expirado
- ✅ Teste de backend deve retornar 200 ou 404 (não 401)
- ✅ Onboarding deve retornar 200

---

## 🎯 Checklist de Verificação

### Frontend:
- [ ] Publishable key está COMPLETA no `.env.production`
- [ ] Build foi executado após atualizar a key
- [ ] Deploy foi feito após o build
- [ ] Cache do navegador foi limpo (modo anônimo)

### Backend:
- [ ] CLERK_SECRET_KEY está configurado (verificar com `npx wrangler secret list`)
- [ ] Secret key corresponde ao ambiente da publishable key
- [ ] Backend está deployado e funcionando (`/health` retorna 200)

### Clerk Dashboard:
- [ ] Domínio customizado `clerk.fitpro.vip` está configurado
- [ ] 5 CNAMEs DNS estão ativos
- [ ] Ambiente Production está selecionado
- [ ] Keys copiadas são do ambiente correto

---

## 🔬 Debug Avançado

### Ver o que o backend está recebendo:

**Tail dos logs do worker:**
```bash
cd C:\fitness_pro\apps\api
npx wrangler tail --format pretty
```

**Em outra janela, teste o onboarding no browser**

**O que procurar nos logs:**
```
Authentication error: [mensagem de erro]
```

**Erros comuns:**
- `Invalid token signature` = Secret key incorreta
- `Token expired` = Token expirou, faça logout/login
- `Failed to fetch JWKS` = Domínio Clerk não resolve
- `Missing or invalid Authorization header` = Token não está sendo enviado

---

## 🆘 Se Ainda Não Funcionar

### Teste Simples com cURL:

1. **Obtenha um token válido:**
   - Abra `test-auth-debug.html`
   - Faça login
   - Copie o token completo

2. **Teste direto no backend:**
```bash
curl -X POST https://fitness-pro-api.chatbotimoveis.workers.dev/api/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [COLE_O_TOKEN_AQUI]" \
  -d '{
    "goal": "gain_muscle",
    "frequencyPerWeek": 3,
    "location": "gym",
    "experienceLevel": "beginner",
    "equipment": ["full_gym"],
    "limitations": []
  }'
```

**Resultado esperado:**
- 200 OK = Funcionou! ✅
- 401 = Problema com token ou secret key ❌
- 400 = Problema com dados enviados ❌

---

## 📊 Comparação: O Que Mudou

### ANTES (Erro de CSP):
```
Refused to connect because it violates the document's Content Security Policy
```

### AGORA (Erro 401):
```
Failed to load resource: 401 Unauthorized
API Error: [objeto com detalhes do erro]
```

**Isso é PROGRESSO!** 🎉

- ✅ CSP não está mais bloqueando
- ✅ Requisição está chegando no backend
- ✅ Backend está processando a requisição
- ❌ Backend está rejeitando por problema de autenticação

---

## 🎯 Próximo Passo Imediato

**USE A FERRAMENTA DE DEBUG:**

```bash
start C:\fitness_pro\test-auth-debug.html
```

1. Faça login em fitpro.vip em outra aba
2. Volte para a ferramenta de debug
3. Clique em "Verificar Clerk"
4. Clique em "Decodificar Token"
5. Tire screenshot dos resultados
6. Me envie para análise

**A ferramenta vai mostrar EXATAMENTE o que está errado com a autenticação!** 🔍

---

## 📝 Resumo

| Item | Status |
|------|--------|
| CSP | ✅ Corrigido |
| Backend | ✅ Funcionando |
| Frontend | ✅ Deployado |
| Conexão | ✅ Funcionando |
| Autenticação | ❌ Erro 401 |
| **Causa provável** | Publishable ou Secret Key incorreta |
| **Solução** | Verificar keys no Clerk Dashboard |

---

**Última atualização:** 09/01/2026
**Próxima ação:** Usar `test-auth-debug.html` para diagnosticar
