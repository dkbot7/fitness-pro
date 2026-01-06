# 🐛 Fix: Erro no Onboarding

## ❌ Problema
Ao tentar salvar informações do onboarding, o usuário recebia:
```
fitpro.vip diz
Erro ao salvar suas informações. Por favor, tente novamente.
```

## 🔍 Causa Raiz
O frontend estava chamando o endpoint errado:
- ❌ **Frontend chamava**: `${apiUrl}/onboarding`
- ✅ **API espera**: `${apiUrl}/api/onboarding`

## 📝 Código Problemático
```typescript
// apps/web/src/app/(dashboard)/onboarding/page.tsx (ANTES)
const response = await fetch(`${apiUrl}/onboarding`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

## ✅ Solução
```typescript
// apps/web/src/app/(dashboard)/onboarding/page.tsx (DEPOIS)
const response = await fetch(`${apiUrl}/api/onboarding`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

## 🔧 Mudança
```diff
- const response = await fetch(`${apiUrl}/onboarding`, {
+ const response = await fetch(`${apiUrl}/api/onboarding`, {
```

## 📊 Endpoints Corretos
Todos os endpoints da API usam o prefixo `/api/`:

```
✅ POST   /api/onboarding
✅ GET    /api/training/plan
✅ POST   /api/training/complete
✅ POST   /api/feedback
✅ GET    /api/users/me/profile
✅ GET    /api/users/me/stats
✅ GET    /api/users/me/workouts/history
✅ GET    /api/gamification/streak
✅ GET    /api/gamification/achievements
✅ POST   /api/gamification/check-unlocks
```

## 🚀 Deploy
- **Commit**: 09a8b6f
- **Deploy URL**: https://e2754fdb.fitness-pro-2ph.pages.dev
- **Production**: https://fitpro.vip

## ✅ Status
**RESOLVIDO** - O onboarding agora funciona corretamente!

## 🧪 Como Testar
1. Acesse https://fitpro.vip/onboarding
2. Preencha as 4 etapas
3. Clique em "Finalizar"
4. ✅ Deve salvar com sucesso e redirecionar para /plano

---
**Fix aplicado**: 05/01/2026 20:00
**Deployment**: LIVE
