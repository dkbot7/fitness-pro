# Adicionar www.fitpro.vip ao Cloudflare Pages

## 🎯 Objetivo
Fazer com que **www.fitpro.vip** também funcione, além de **fitpro.vip**.

## 📋 Passos

### 1. Acessar Custom Domains
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains

### 2. Adicionar www.fitpro.vip
1. Clique em **"Set up a custom domain"**
2. Digite: `www.fitpro.vip`
3. Clique em **"Continue"**
4. Clique em **"Activate domain"**

### 3. Aguardar Ativação
- Status inicial: **Verifying** ou **Initializing**
- Aguarde: 5-30 minutos
- Status final: **Active** ✅

### 4. Testar
```bash
curl -I https://www.fitpro.vip
# Deve retornar: HTTP/1.1 200 OK
```

## 🔄 Opcional: Redirecionar www → apex

Se quiser que **www.fitpro.vip** redirecione automaticamente para **fitpro.vip**:

### 1. Acesse Redirect Rules
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/rules/redirect-rules

### 2. Criar Rule
1. Clique em **"Create rule"**
2. **Rule name:** `Redirect www to apex`
3. **When incoming requests match:**
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `www.fitpro.vip`
4. **Then:**
   - Type: **Dynamic**
   - Expression: `concat("https://fitpro.vip", http.request.uri.path)`
   - Status code: **301** (Permanent Redirect)
5. Clique em **"Deploy"**

### 3. Testar
```bash
curl -I https://www.fitpro.vip
# Deve retornar: HTTP/1.1 301 Moved Permanently
# Location: https://fitpro.vip
```

## ✅ Status Esperado

Após configuração completa:

```bash
# Ambos devem funcionar:
https://fitpro.vip        → Site (200 OK)
https://www.fitpro.vip    → Site (200 OK) ou Redirect (301)
```

## 📊 Configuração DNS

O Cloudflare cria automaticamente um CNAME record:

```
Type: CNAME
Name: www.fitpro.vip
Target: fitness-pro-2ph.pages.dev
Proxy: Enabled (nuvem laranja)
```

Você pode verificar em:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/dns

## 🆘 Troubleshooting

### Status fica em "Verifying" por muito tempo
- Aguarde até 1 hora
- Verifique se o domínio fitpro.vip está ativo primeiro
- Tente remover e adicionar novamente

### Erro 522 (Connection Timeout)
- Ainda está propagando DNS
- Aguarde mais 10-20 minutos
- Limpe cache do navegador

### www não aparece como opção
- Certifique-se de que fitpro.vip já está Active
- Use o domínio exato: `www.fitpro.vip` (não `www`)

---

**Após configurar, ambos os domínios estarão funcionando! 🎉**
