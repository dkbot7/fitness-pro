# 🔑 Criar API Token para Configuração Automática

## 🎯 Permissões Necessárias

Para configurar o domínio fitpro.vip automaticamente via API, o token precisa das seguintes permissões:

### 1. Acesse a criação de token:
https://dash.cloudflare.com/profile/api-tokens

### 2. Clique em "Create Token"

### 3. Configure as permissões:

**Opção A: Usar template "Edit Cloudflare Pages"**
1. Encontre o template **"Edit Cloudflare Pages"**
2. Clique em **"Use template"**
3. Em **"Account Resources"**, selecione: **Include > Specific account > Dani Kaloi**
4. Em **"Zone Resources"**, selecione: **Include > Specific zone > fitpro.vip** (se o domínio já estiver na conta)
5. Clique em **"Continue to summary"**
6. Clique em **"Create Token"**

**Opção B: Criar token custom (mais flexível)**

Configure estas permissões:

#### **Permissions:**

**Account:**
- Account > Cloudflare Pages > **Edit** [OK]
- Account > Account Settings > **Read** [OK]

**Zone (se fitpro.vip já está no Cloudflare):**
- Zone > DNS > **Edit** [OK]
- Zone > Zone > **Edit** [OK]
- Zone > Zone Settings > **Edit** [OK]

#### **Account Resources:**
- Include > Specific account > **Dani Kaloi** (ce11d202b2917777965b5131b5edc627)

#### **Zone Resources (se aplicável):**
- Include > Specific zone > **fitpro.vip**

#### **Client IP Address Filtering (opcional):**
- Deixe vazio para permitir de qualquer IP
- Ou adicione seu IP atual para mais segurança

#### **TTL:**
- Recomendado: **1 day** ou **1 week**
- Depois de configurar, você pode deletar o token

### 4. Copie o Token

Após criar, você verá algo assim:
```
Token created successfully

Your API Token is:
bQVGN8K9xqP7mR2sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF3g

IMPORTANT: This token will only be shown once. Make sure to copy it now.
```

**COPIE O TOKEN COMPLETO** e me envie.

---

## 🔒 Segurança

### Depois de configurar o domínio:

1. **Delete o token** (não será mais necessário)
2. Acesse: https://dash.cloudflare.com/profile/api-tokens
3. Encontre o token criado
4. Clique em **"Delete"**

### O token permite:
- [OK] Adicionar domínios ao Pages project
- [OK] Modificar configurações do Pages
- [OK] Configurar DNS records (se necessário)
- [X] NÃO permite: deletar projetos, modificar billing, etc.

---

## 📋 O Que Vou Fazer Com o Token

Quando você me enviar o token, vou executar:

1. **Adicionar fitpro.vip ao projeto fitness-pro**
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/pages/projects/fitness-pro/domains" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"name":"fitpro.vip"}'
   ```

2. **Adicionar www.fitpro.vip ao projeto**
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/pages/projects/fitness-pro/domains" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"name":"www.fitpro.vip"}'
   ```

3. **Verificar status dos domínios**
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/pages/projects/fitness-pro/domains" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Verificar/Configurar DNS (se o domínio já estiver no Cloudflare)**
   - Verificar se CNAME/A records existem
   - Criar records se necessário
   - Ativar Proxy (nuvem laranja)

5. **Aguardar validação**
   - Verificar status até ficar "Active"
   - Testar acesso ao domínio

---

## [OK] Após Configuração

Vou te informar:
- [OK] Status de cada domínio (Active/Pending)
- [OK] DNS records criados
- [OK] SSL status
- [OK] Tempo estimado para propagação
- [OK] Links para testar

E você pode **deletar o token** imediatamente após.

---

## 🆘 Se Tiver Problemas

### Erro: "Token does not have required permissions"
→ Verifique se adicionou permissão **"Cloudflare Pages - Edit"**
→ Verifique se selecionou a conta correta

### Erro: "Zone not found"
→ O domínio fitpro.vip precisa estar adicionado ao Cloudflare primeiro
→ Se não estiver, posso te guiar via dashboard

### Token não funciona
→ Verifique se copiou o token completo
→ Token deve começar com letras/números aleatórios
→ Não deve ter espaços no início/fim

---

**Quando tiver o token, cole aqui e vou configurar tudo automaticamente! 🚀**
