# ⚠️ Problema: Erro 522 Persiste

## Status Atual

✅ **Variáveis de Ambiente**: Configuradas corretamente (7/7)
✅ **Deployment**: Build completou (Status: Active)
❌ **Worker**: Não está respondendo (HTTP 522)

## Causa Provável: Build Command Incorreto

O Cloudflare Pages provavelmente está usando o **build command antigo** ou **incorreto**.

---

## 🔧 SOLUÇÃO: Atualizar Build Settings

### 1️⃣ Acesse Build Settings
```
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds
```

### 2️⃣ Verifique as Configurações Atuais

Provavelmente está assim (INCORRETO):
```bash
Build command: cd apps/web && pnpm install && pnpm build && npx @opennextjs/cloudflare
Build output: apps/web/.worker-next
```

### 3️⃣ Atualize Para (CORRETO):

**Framework preset**:
```
Next.js
```

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

### 4️⃣ Clique em "Save"

Isso vai automaticamente triggerar um novo deployment.

---

## ❓ Por Que o Comando Anterior Falhava?

1. **Faltava `build --skipBuild`** no final do OpenNext
   - Sem isso, o OpenNext tenta buildar novamente (erro)

2. **Não instalava deps da raiz** primeiro
   - Monorepo precisa das deps da raiz instaladas

3. **Comando incompleto do OpenNext**
   - Precisa especificar `build --skipBuild` após o Next.js build

---

## 🎯 Comando Completo Explicado

```bash
# 1. Instalar deps do monorepo (raiz)
pnpm install --frozen-lockfile

# 2. Ir para o app web
&& cd apps/web

# 3. Buildar Next.js (gera .next)
&& pnpm build

# 4. Converter para Cloudflare Worker (gera .worker-next)
&& npx @opennextjs/cloudflare@latest build --skipBuild
```

---

## ✅ Após Atualizar

1. O Cloudflare vai triggerar novo deployment automaticamente
2. Aguarde ~5-10 minutos
3. Teste novamente:
   ```bash
   curl -I https://fitness-pro-2ph.pages.dev
   ```
4. Deve retornar **200 OK**

---

## 📊 Checklist

- [ ] Acessou: https://dash.cloudflare.com/.../fitness-pro/settings/builds
- [ ] Verificou build command atual
- [ ] Atualizou para o comando correto
- [ ] Clicou em "Save"
- [ ] Aguardou deployment completar
- [ ] Testou e recebeu 200 OK

---

**Link Direto**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds
