# Configuração do Domínio fitpro.vip

## [OK] Passo 1: Adicionar ao Cloudflare

**Status**: 🔄 Em andamento

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
2. Clique em **"Add a Site"** (botão azul no topo)
3. Digite: `fitpro.vip`
4. Escolha o plano: **Free ($0/mês)**
5. Clique em **"Continue"**
6. Cloudflare irá escanear seus registros DNS atuais
7. Clique em **"Continue"** novamente
8. **IMPORTANTE**: Copie os 2 nameservers que aparecerem

Exemplo de nameservers (os seus serão diferentes):
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

---

## 📋 Passo 2: Atualizar Nameservers na GoDaddy

Após obter os nameservers do Cloudflare:

1. Acesse: https://dcc.godaddy.com/domains
2. Encontre **fitpro.vip** na lista
3. Clique nos **3 pontinhos** (⋮) ao lado do domínio
4. Selecione **"Manage DNS"** ou **"Gerenciar DNS"**
5. Role até a seção **"Nameservers"**
6. Clique em **"Change"** ou **"Alterar"**
7. Selecione **"I'll use my own nameservers"** ou **"Usar meus próprios nameservers"**
8. Digite os 2 nameservers do Cloudflare:
   - Nameserver 1: `<primeiro-nameserver>.ns.cloudflare.com`
   - Nameserver 2: `<segundo-nameserver>.ns.cloudflare.com`
9. Clique em **"Save"** ou **"Salvar"**

[!] **ATENÇÃO**: A GoDaddy pode mostrar um aviso que você perderá o gerenciamento DNS. Isso é normal - você gerenciará via Cloudflare agora.

---

## ⏱️ Passo 3: Aguardar Propagação DNS

- **Tempo médio**: 15 minutos a 2 horas
- **Tempo máximo**: 24-48 horas (raro)

### Verificar Propagação:

```bash
# Via linha de comando (Windows)
nslookup -type=NS fitpro.vip

# Resultado esperado após propagação:
# fitpro.vip nameserver = alice.ns.cloudflare.com
# fitpro.vip nameserver = bob.ns.cloudflare.com
```

**Ferramenta online**: https://www.whatsmydns.net/#NS/fitpro.vip

Quando ver os nameservers do Cloudflare em múltiplas localizações globais, a propagação está completa.

---

## 🔧 Passo 4: Configurar Registros DNS no Cloudflare

Após a propagação estar completa, configure os registros DNS:

### Para o Frontend (Cloudflare Pages)

1. No dashboard do Cloudflare, vá em **DNS** > **Records**
2. Adicione os seguintes registros:

**Domínio principal (fitpro.vip)**:
```
Type: CNAME
Name: @
Target: fitness-pro.pages.dev
Proxied: [OK] Sim (nuvem laranja ativa)
TTL: Auto
```

**Subdomínio www (www.fitpro.vip)**:
```
Type: CNAME
Name: www
Target: fitness-pro.pages.dev
Proxied: [OK] Sim (nuvem laranja ativa)
TTL: Auto
```

### Para a API (Cloudflare Workers)

**Subdomínio API (api.fitpro.vip)**:
```
Type: CNAME
Name: api
Target: fitness-pro-api.workers.dev
Proxied: [OK] Sim (nuvem laranja ativa)
TTL: Auto
```

**OU** você pode configurar rotas diretamente no Worker (recomendado):

No `apps/api/wrangler.toml`, adicione:
```toml
routes = [
  { pattern = "api.fitpro.vip/*", zone_name = "fitpro.vip" }
]
```

---

## 🎯 Passo 5: Atualizar Configurações no Projeto

### 5.1 Atualizar Variáveis de Ambiente

**apps/web/.env.production** (criar arquivo):
```env
NEXT_PUBLIC_API_URL=https://api.fitpro.vip
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 5.2 Atualizar CORS na API

**apps/api/src/index.ts** (linha ~17):
```typescript
cors({
  origin: [
    'https://fitpro.vip',
    'https://www.fitpro.vip',
    'http://localhost:3000' // Manter para dev
  ],
  credentials: true,
})
```

### 5.3 Atualizar Clerk

1. Acesse: https://dashboard.clerk.com
2. Selecione sua aplicação
3. Vá em **Domains**
4. Adicione:
   - Production: `https://fitpro.vip`
   - Production: `https://www.fitpro.vip`
5. Configure redirects:
   - After sign in: `/`
   - After sign up: `/onboarding`

---

## [OK] Verificação Final

Depois de tudo configurado:

```bash
# Testar DNS
nslookup fitpro.vip
nslookup www.fitpro.vip
nslookup api.fitpro.vip

# Testar HTTPS
curl -I https://fitpro.vip
curl -I https://api.fitpro.vip/health

# Testar no navegador
# https://fitpro.vip - Deve carregar a aplicação
# https://www.fitpro.vip - Deve carregar a aplicação
# https://api.fitpro.vip/health - Deve retornar {"status":"ok"}
```

---

## 🚨 Troubleshooting

### Problema: "DNS_PROBE_FINISHED_NXDOMAIN"
- **Causa**: DNS ainda não propagou
- **Solução**: Aguardar mais tempo ou limpar cache DNS local
  ```bash
  ipconfig /flushdns  # Windows
  ```

### Problema: "ERR_TOO_MANY_REDIRECTS"
- **Causa**: Loop de redirecionamento SSL
- **Solução**: Verificar configuração SSL/TLS no Cloudflare
  - Ir em SSL/TLS > Overview
  - Configurar como **"Full"** ou **"Full (strict)"**

### Problema: "This site can't be reached"
- **Causa**: Registros DNS incorretos
- **Solução**: Verificar se os CNAMEs estão apontando corretamente

---

## 📊 Status Atual

- [ ] Domínio adicionado ao Cloudflare
- [ ] Nameservers atualizados na GoDaddy
- [ ] Propagação DNS completa
- [ ] Registros DNS configurados
- [ ] Variáveis de ambiente atualizadas
- [ ] CORS atualizado
- [ ] Clerk configurado
- [ ] SSL/TLS funcionando
- [ ] Aplicação acessível em fitpro.vip

---

**Última atualização**: 05/01/2026
**Domínio**: fitpro.vip
**Registrador**: GoDaddy
**DNS Manager**: Cloudflare
