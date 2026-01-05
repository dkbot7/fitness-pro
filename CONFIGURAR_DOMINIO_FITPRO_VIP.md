# 🌐 Configurar Domínio Custom: fitpro.vip

## 📋 Pré-requisitos

✅ Você já deve ter:
- Domínio fitpro.vip registrado
- Acesso ao painel do registrador de domínio
- Conta Cloudflare com o projeto fitness-pro

---

## 🎯 PASSO 1: Verificar/Adicionar Domínio ao Cloudflare

### Opção A: Se o domínio JÁ está no Cloudflare

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
2. Verifique se **fitpro.vip** aparece na lista de sites
3. Se sim, pule para o PASSO 2

### Opção B: Se o domínio NÃO está no Cloudflare

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
2. Clique em **"Add a Site"**
3. Digite: **fitpro.vip**
4. Clique em **"Add site"**
5. Escolha o plano **Free**
6. Cloudflare vai escanear os DNS records existentes
7. Clique em **"Continue"**
8. Anote os nameservers que o Cloudflare fornecer (algo como):
   ```
   alexa.ns.cloudflare.com
   brandon.ns.cloudflare.com
   ```

---

## 🎯 PASSO 2: Configurar Nameservers (se necessário)

### Se o domínio não estava no Cloudflare:

1. Acesse o painel do seu **registrador de domínio** (onde você comprou fitpro.vip)
   - Pode ser: Registro.br, GoDaddy, Namecheap, Google Domains, etc.

2. Encontre a seção **"Nameservers"** ou **"DNS"**

3. Mude de **"Default Nameservers"** para **"Custom Nameservers"**

4. Substitua pelos nameservers do Cloudflare:
   ```
   alexa.ns.cloudflare.com
   brandon.ns.cloudflare.com
   ```
   (Use os nameservers que o Cloudflare mostrou no PASSO 1)

5. Salve as mudanças

6. **AGUARDE:** Propagação de nameservers pode levar de 5 minutos a 24 horas (geralmente 1-2 horas)

### Se o domínio já estava no Cloudflare:

✅ Nameservers já estão corretos, pule para o PASSO 3

---

## 🎯 PASSO 3: Adicionar Domínio ao Pages Project

### 3.1 Acesse as configurações de domínios:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains

### 3.2 Adicione o domínio custom:

1. Clique em **"Set up a custom domain"**

2. Digite: **fitpro.vip**

3. Clique em **"Continue"**

4. Cloudflare vai verificar se o domínio está na conta

5. Se tudo ok, você verá:
   - **Domain:** fitpro.vip
   - **Status:** Pending validation ou Active

6. Clique em **"Activate domain"**

### 3.3 Configuração DNS automática:

Se o domínio JÁ está no Cloudflare, o DNS será configurado **automaticamente**:
- Cloudflare cria um CNAME record apontando para fitness-pro-2ph.pages.dev
- Ou um A/AAAA record se for root domain

Se o domínio NÃO está no Cloudflare ainda, você precisará:
- Aguardar nameservers propagarem
- Depois o DNS será configurado automaticamente

---

## 🎯 PASSO 4: Adicionar www.fitpro.vip (Opcional mas Recomendado)

### Adicione também o subdomínio www:

1. Na mesma página de domínios, clique em **"Set up a custom domain"** novamente

2. Digite: **www.fitpro.vip**

3. Clique em **"Continue"** e **"Activate domain"**

4. Cloudflare vai criar um CNAME apontando para fitness-pro-2ph.pages.dev

### Configure redirect www → root (ou vice-versa):

**Opção 1: Redirecionar www.fitpro.vip → fitpro.vip**

1. Vá para: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/rules/redirect-rules

2. Clique em **"Create rule"**

3. Configure:
   - **Rule name:** Redirect www to apex
   - **When incoming requests match:**
     - Field: `Hostname`
     - Operator: `equals`
     - Value: `www.fitpro.vip`
   - **Then:**
     - **Type:** Dynamic
     - **Expression:** `concat("https://fitpro.vip", http.request.uri.path)`
     - **Status code:** 301
   - **Preserve query string:** Yes

4. Clique em **"Deploy"**

---

## 🎯 PASSO 5: Verificar DNS Records

### Acesse o DNS do domínio:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/dns

### Você deve ver algo assim:

```
Type    Name              Content                           Proxy Status
────────────────────────────────────────────────────────────────────────
CNAME   fitpro.vip        fitness-pro-2ph.pages.dev         Proxied
CNAME   www.fitpro.vip    fitness-pro-2ph.pages.dev         Proxied
```

Ou:

```
Type    Name              Content                           Proxy Status
────────────────────────────────────────────────────────────────────────
A       fitpro.vip        192.0.2.1 (Cloudflare IP)         Proxied
AAAA    fitpro.vip        2606:4700::1 (Cloudflare IPv6)    Proxied
CNAME   www.fitpro.vip    fitness-pro-2ph.pages.dev         Proxied
```

**IMPORTANTE:** Status deve ser **"Proxied"** (nuvem laranja), não "DNS only"

---

## 🎯 PASSO 6: Verificar Status de Ativação

### Volte para os domínios do Pages:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/fitness-pro/settings/domains

### Status dos domínios:

**Enquanto aguarda propagação:**
```
fitpro.vip           ⏳ Pending validation
www.fitpro.vip       ⏳ Pending validation
```

**Após propagação (5-30 minutos):**
```
fitpro.vip           ✅ Active
www.fitpro.vip       ✅ Active
```

---

## 🎯 PASSO 7: Testar o Domínio

### Quando status = Active:

1. **Teste no navegador:**
   - https://fitpro.vip
   - https://www.fitpro.vip

2. **Teste via curl:**
   ```bash
   curl -I https://fitpro.vip
   # Deve retornar: HTTP/2 200
   ```

3. **Verifique SSL:**
   - Cloudflare gera SSL automaticamente
   - Certificado aparece em alguns segundos
   - https:// deve funcionar sem avisos

### Se ainda não funcionar:

**Aguarde mais tempo:**
- DNS pode levar até 24 horas para propagar globalmente
- Localmente pode funcionar mais rápido

**Limpe cache DNS local:**
```bash
# Windows
ipconfig /flushdns

# Mac/Linux
sudo dscacheutil -flushcache
```

**Teste em modo anônimo:**
- Navegador pode ter cache
- Abra janela anônima/privada

---

## 🔍 Verificar Propagação DNS

### Ferramentas online:

1. **WhatsMyDNS.net**
   - Acesse: https://www.whatsmydns.net
   - Digite: fitpro.vip
   - Tipo: CNAME ou A
   - Veja propagação mundial

2. **DNS Checker**
   - Acesse: https://dnschecker.org
   - Digite: fitpro.vip
   - Veja servidores em vários países

### Via terminal:

```bash
# Windows
nslookup fitpro.vip

# Mac/Linux
dig fitpro.vip

# Verificar nameservers
nslookup -type=NS fitpro.vip
# Deve retornar nameservers do Cloudflare
```

---

## ⚙️ Configurações SSL/TLS

### Configure HTTPS forçado:

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/ssl-tls

2. **SSL/TLS encryption mode:**
   - Selecione: **"Full (strict)"** ✅ (Recomendado)
   - Não use "Flexible" (inseguro)

3. **Always Use HTTPS:**
   - Vá para: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/fitpro.vip/ssl-tls/edge-certificates
   - Ative: **"Always Use HTTPS"** ✅
   - Força redirect http:// → https://

4. **Automatic HTTPS Rewrites:**
   - Ative: **"Automatic HTTPS Rewrites"** ✅

5. **Minimum TLS Version:**
   - Recomendado: **TLS 1.2** ou superior

---

## 🚀 Após Configuração

### Verificações finais:

- [ ] fitpro.vip abre o site ✅
- [ ] www.fitpro.vip abre o site ✅
- [ ] http://fitpro.vip redireciona para https:// ✅
- [ ] SSL funciona sem avisos ✅
- [ ] Login/Register funcionam ✅
- [ ] Todas as páginas carregam ✅
- [ ] API calls funcionam ✅

### URLs que devem funcionar:

```
✅ https://fitpro.vip
✅ https://www.fitpro.vip
✅ https://fitpro.vip/login
✅ https://fitpro.vip/register
✅ https://fitpro.vip/onboarding
✅ https://fitpro.vip/plano
✅ https://fitpro.vip/perfil
✅ https://fitpro.vip/conquistas
```

### URLs do projeto (ainda funcionam):

```
✅ https://fitness-pro-2ph.pages.dev (Pages URL)
✅ https://3b770031.fitness-pro-2ph.pages.dev (Deployment específico)
```

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│ CONFIGURAÇÃO COMPLETA                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Usuário digita: fitpro.vip                                 │
│         ↓                                                    │
│  DNS Cloudflare resolve                                     │
│         ↓                                                    │
│  Cloudflare Proxy (CDN + SSL)                               │
│         ↓                                                    │
│  Cloudflare Pages (fitness-pro)                             │
│         ↓                                                    │
│  Vite app servido                                           │
│         ↓                                                    │
│  API calls → api.fitpro.vip (Worker)                        │
│         ↓                                                    │
│  Database → D1                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Erro: "Domain not found in account"
→ Adicione o domínio ao Cloudflare primeiro (PASSO 1)
→ Aguarde nameservers propagarem

### Erro: "Domain validation failed"
→ Verifique se nameservers estão corretos
→ Aguarde mais tempo (até 24h)
→ Verifique se domínio não tem DNSSEC ativo no registrador

### Erro: "SSL certificate pending"
→ Normal - aguarde 5-15 minutos
→ Cloudflare gera certificado automaticamente

### Site abre mas mostra erro SSL
→ Verifique SSL mode: deve ser "Full (strict)"
→ Aguarde certificado ser gerado
→ Limpe cache do navegador

### www.fitpro.vip não funciona
→ Adicione como domínio separado no Pages
→ Ou configure redirect www → apex

### DNS não propaga
→ Aguarde mais tempo (até 24h)
→ Verifique nameservers no registrador
→ Use ferramentas de verificação DNS

---

## 📝 Checklist Completo

### Configuração Inicial:
- [ ] Domínio fitpro.vip registrado
- [ ] Domínio adicionado ao Cloudflare
- [ ] Nameservers apontando para Cloudflare
- [ ] Nameservers propagados

### Configuração Pages:
- [ ] Domínio fitpro.vip adicionado ao projeto
- [ ] Domínio www.fitpro.vip adicionado (opcional)
- [ ] DNS records criados automaticamente
- [ ] Status: Active

### Configuração SSL/TLS:
- [ ] SSL mode: Full (strict)
- [ ] Always Use HTTPS: Ativado
- [ ] Automatic HTTPS Rewrites: Ativado
- [ ] Certificado gerado

### Testes:
- [ ] https://fitpro.vip abre
- [ ] https://www.fitpro.vip abre
- [ ] http redireciona para https
- [ ] SSL sem avisos
- [ ] Todas as páginas funcionam
- [ ] Login funciona
- [ ] API calls funcionam

---

## 🎯 Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| Adicionar domínio ao Cloudflare | 2 min |
| Configurar nameservers (se necessário) | 2 min |
| Aguardar propagação nameservers | 1-24h |
| Adicionar domínio ao Pages | 2 min |
| Aguardar ativação | 5-30 min |
| Configurar SSL/TLS | 2 min |
| Testar | 5 min |
| **TOTAL (se nameservers já ok)** | **~15 minutos** |
| **TOTAL (se nameservers novos)** | **1-24 horas** |

---

**Após seguir todos os passos, seu site estará acessível em fitpro.vip! 🚀**
