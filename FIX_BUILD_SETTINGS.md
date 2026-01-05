# 🔧 Corrigir Build Settings - IMPORTANTE

## ⚠️ Problema Detectado

O build automático do GitHub falhou porque o **Build Command** no Cloudflare Pages ainda está configurado para Next.js.

O deploy manual funcionou porque usamos o comando correto localmente.

---

## ✅ SOLUÇÃO: Atualizar Build Settings

### Acesse as configurações de build:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

### Configure exatamente assim:

**Framework preset:**
```
None
```
(ou selecione "Vite" se disponível)

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

**Environment variables:**
(isso será configurado depois, não afeta o build)

---

## 🔄 Após Salvar

Clique em **"Save"** e então:

1. Vá para: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/deployments

2. Encontre o deployment com commit **899f9e7** (status: Failure)

3. Clique nos três pontinhos (...) → **"Retry deployment"**

O build deve:
- ✅ Instalar dependências do monorepo
- ✅ Instalar dependências do apps/web
- ✅ Fazer build do Vite
- ✅ Deploy do diretório dist
- ✅ Concluir em ~1-2 minutos

---

## 🧪 Verificar Build Logs

Se o build falhar novamente:

1. Clique no deployment que falhou
2. Role até "Build log"
3. Procure por erros em vermelho

**Erros comuns:**

### Erro: "Command not found: pnpm"
**Solução:** Build command deve começar com `pnpm install`

### Erro: "No such file or directory: apps/web"
**Solução:** Build command deve ter `cd apps/web`

### Erro: "Cannot find module '@fitness-pro/shared'"
**Solução:** Build command deve ter `pnpm install --frozen-lockfile` no início (instala workspace)

### Erro: "Cannot resolve import '@clerk/clerk-react'"
**Solução:** Dependências instaladas corretamente? Verifique pnpm-lock.yaml

---

## 🎯 Build Command Explicado

```bash
# 1. Instala dependências do workspace (packages/shared, etc)
pnpm install --frozen-lockfile

# 2. Entra no diretório do web app
&& cd apps/web

# 3. Faz build do Vite (já tem as deps instaladas do passo 1)
&& pnpm build
```

O comando final que funcionou localmente:
```bash
pnpm install --frozen-lockfile && cd apps/web && pnpm build && wrangler pages deploy dist --project-name=fitness-pro
```

No Cloudflare Pages, só precisamos da parte de build (sem o deploy manual):
```bash
pnpm install --frozen-lockfile && cd apps/web && pnpm build
```

---

## 📊 Comparação: Antes vs Depois

| Setting | ❌ Next.js (antigo) | ✅ Vite (correto) |
|---------|---------------------|-------------------|
| Framework | Next.js | None/Vite |
| Build command | `cd apps/web && npm install && npm build && npx @opennextjs/cloudflare` | `pnpm install --frozen-lockfile && cd apps/web && pnpm build` |
| Output directory | `.next` ou `apps/web/.next` | `apps/web/dist` |
| Status | 404 errors | ✅ Funcionando |

---

## ✅ Após Configurar

1. **Retry** o deployment que falhou (899f9e7)
2. Aguarde o build (~1-2 min)
3. Acesse o site quando status for "Active"
4. Configure variáveis de ambiente (CONFIGURAR_ENV_VARS.md)
5. Teste todas as funcionalidades

---

**Importante:** O deploy manual funcionou (https://92fa362e.fitness-pro-2ph.pages.dev) porque usamos o comando correto. O build automático vai funcionar após corrigir estas configurações no dashboard.
