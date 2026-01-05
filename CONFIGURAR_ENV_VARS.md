# ⚙️ Configurar Variáveis de Ambiente - PASSO FINAL

## ✅ Status Atual

- ✅ Código migrado para Vite
- ✅ Build local funcionando
- ✅ Deploy manual bem-sucedido
- ✅ Push para GitHub concluído
- 🔄 Build automático iniciado no Cloudflare Pages
- ⏳ **Falta apenas:** Configurar variáveis de ambiente

---

## 🚀 PASSO 1: Configure as Variáveis (1 minuto)

### Acesse o painel de variáveis de ambiente:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/environment-variables

### Clique em "Add variable" e adicione:

**Variável 1:**
```
Variable name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_bmF0aXZlLWhpcHBvLTE0LmNsZXJrLmFjY291bnRzLmRldiQ
Environment: Production and Preview
```

**Variável 2:**
```
Variable name: VITE_API_URL
Value: https://api.fitpro.vip
Environment: Production and Preview
```

### Clique em "Save"

---

## 🔄 PASSO 2: Aguarde o Build Automático

O push para GitHub já acionou um novo build no Cloudflare Pages.

**Acompanhe o progresso:**
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/deployments

O build deve:
1. Detectar o commit "feat: Migrate from Next.js to Vite + React Router"
2. Executar `cd apps/web && pnpm install && pnpm build`
3. Deploy do diretório `apps/web/dist`
4. Concluir em ~1-2 minutos

---

## 🧪 PASSO 3: Teste o Site

Após o build concluir, acesse:
- **Production:** https://fitness-pro-2ph.pages.dev
- **Custom Domain (se configurado):** https://fitpro.vip

### Teste estas funcionalidades:

1. **Landing Page** (/):
   - [ ] Página carrega
   - [ ] Botões "Entrar" e "Criar conta" funcionam

2. **Login** (/login):
   - [ ] Formulário de login aparece
   - [ ] Login funciona

3. **Onboarding** (/onboarding):
   - [ ] 4 passos carregam
   - [ ] Consegue avançar e finalizar
   - [ ] Redireciona para /plano

4. **Plano de Treino** (/plano):
   - [ ] Lista de treinos aparece
   - [ ] Cards dos treinos estão corretos

5. **Treino** (/treino/1):
   - [ ] Exercícios carregam
   - [ ] Timer funciona
   - [ ] Pode marcar séries

6. **Feedback** (/treino/1/feedback):
   - [ ] Formulário aparece
   - [ ] Pode selecionar dificuldade
   - [ ] Consegue enviar

7. **Perfil** (/perfil):
   - [ ] Informações do usuário aparecem
   - [ ] Estatísticas carregam
   - [ ] Botão "Sair" funciona

8. **Conquistas** (/conquistas):
   - [ ] Grid de conquistas aparece
   - [ ] Cards de streak funcionam

---

## 🔍 Verificar Configuração de Build (opcional)

Se o build falhar ou der erro, verifique:

**Build Settings:**
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/builds

**Deve estar:**
- Framework preset: `None` (ou `Vite`)
- Build command: `cd apps/web && pnpm install && pnpm build`
- Build output directory: `apps/web/dist`
- Root directory: `/` (vazio)

---

## 🌐 Configurar Domínio Custom (opcional)

Se ainda não estiver configurado:

**Domains:**
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains

1. Clique em "Set up a custom domain"
2. Digite: `fitpro.vip`
3. Aguarde validação DNS (alguns minutos)
4. Acesse https://fitpro.vip

---

## ❌ Se algo der errado

### Build falhou?
Verifique os logs do build:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/deployments

**Erros comuns:**
- Variáveis de ambiente não configuradas → Configure no PASSO 1
- Build command errado → Verifique Build Settings
- Dependencies faltando → Build deve rodar `pnpm install`

### Site carrega mas login não funciona?
- Verifique se `VITE_CLERK_PUBLISHABLE_KEY` está configurada
- Confirme que o valor é: `pk_test_bmF0aXZlLWhpcHBvLTE0LmNsZXJrLmFjY291bnRzLmRldiQ`

### Erros de API?
- Verifique se `VITE_API_URL` está configurada
- Confirme que o valor é: `https://api.fitpro.vip`
- Teste a API diretamente: https://api.fitpro.vip/health

---

## 🎉 Quando tudo estiver funcionando

O projeto estará 100% operacional em produção!

**Próximos deployments:**
- Qualquer `git push` para `main` acionará build automático
- Build leva ~1-2 minutos
- Deploy é instantâneo após build
- Não precisa fazer nada manual

**Monitoramento:**
- Deployments: https://dash.cloudflare.com/pages/view/fitness-pro/deployments
- Analytics: https://dash.cloudflare.com/pages/view/fitness-pro/analytics
- Logs: Disponíveis em cada deployment

---

## 📊 Comparação Final: Next.js vs Vite

| Aspecto | Next.js (antes) | Vite (agora) |
|---------|-----------------|--------------|
| Build Status | ❌ 404 errors | ✅ Funcionando |
| Build Time | ~30s + falhas | ~6s |
| Deploy | ❌ Manual + problemas | ✅ Automático |
| Compatibilidade | ❌ Adaptadores | ✅ Nativo |
| Bundle Size | ~2 MB | 1.4 MB (316 KB gzip) |
| Manutenção | 🔴 Complexo | 🟢 Simples |

---

**Tudo pronto para produção! 🚀**

Após configurar as variáveis de ambiente, o projeto estará 100% funcional.
