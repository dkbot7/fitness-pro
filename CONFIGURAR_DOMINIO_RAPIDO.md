# ⚡ Configurar fitpro.vip - Guia Rápido

## 🎯 Passos Diretos (15 minutos se nameservers já estão ok)

### ✅ PASSO 1: Adicionar Domínio ao Pages

**Link direto:**
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains

1. Clique em **"Set up a custom domain"**
2. Digite: **fitpro.vip**
3. Clique em **"Continue"**
4. Clique em **"Activate domain"**

---

### ✅ PASSO 2: Adicionar www (Opcional)

Na mesma página:

1. Clique em **"Set up a custom domain"** novamente
2. Digite: **www.fitpro.vip**
3. Clique em **"Continue"**
4. Clique em **"Activate domain"**

---

### ✅ PASSO 3: Verificar Status

Na mesma página, aguarde até ver:

```
fitpro.vip          ✅ Active
www.fitpro.vip      ✅ Active
```

Isso pode levar de **5 minutos a 2 horas** dependendo de:
- Se o domínio já está no Cloudflare
- Se os nameservers já estão configurados
- Propagação DNS

---

## 🔍 Verificar Configuração

### Se aparecer erro "Domain not found":

**Verifique se o domínio está no Cloudflare:**
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627

Se **fitpro.vip NÃO aparece** na lista:

1. Clique em **"Add a Site"**
2. Digite: **fitpro.vip**
3. Escolha plano **Free**
4. Cloudflare vai mostrar **nameservers** (ex: alexa.ns.cloudflare.com)
5. Configure esses nameservers no seu **registrador de domínio**
6. Aguarde propagação (1-24 horas)
7. Depois volte e adicione ao Pages

---

## 🧪 Testar

Quando status = Active:

```bash
# Teste no navegador:
https://fitpro.vip

# Teste via terminal:
curl -I https://fitpro.vip
# Deve retornar: HTTP/2 200
```

---

## 📋 Checklist Rápido

- [ ] Domínio fitpro.vip adicionado ao Pages
- [ ] Status mostra "Active"
- [ ] https://fitpro.vip abre o site
- [ ] SSL funciona (sem avisos)
- [ ] Login funciona

---

## 🆘 Se não funcionar:

**1. Domínio não está no Cloudflare:**
→ Adicione em: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627

**2. Status fica em "Pending validation":**
→ Aguarde mais tempo (até 2 horas)
→ Verifique nameservers no registrador

**3. Erro SSL:**
→ Aguarde 5-15 minutos
→ Cloudflare gera certificado automaticamente

---

## 📚 Documentação Completa

Para detalhes completos, veja:
`CONFIGURAR_DOMINIO_FITPRO_VIP.md`

---

**Links Úteis:**

- **Adicionar domínio ao Pages:** https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains
- **Sites Cloudflare:** https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
- **Verificar DNS:** https://www.whatsmydns.net
