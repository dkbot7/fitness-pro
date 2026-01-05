#!/bin/bash
# Script para adicionar fitpro.vip ao Cloudflare
# Uso: ./add-domain-to-cloudflare.sh <CLOUDFLARE_API_TOKEN>

set -e

DOMAIN="fitpro.vip"
ACCOUNT_ID="ce11d202b2917777965b5131b5edc627"
API_TOKEN="${1:-}"

if [ -z "$API_TOKEN" ]; then
    echo "❌ Erro: API Token não fornecido"
    echo ""
    echo "📋 Para obter um API Token:"
    echo "1. Acesse: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use template 'Edit zone DNS' ou crie custom com:"
    echo "   - Permissions: Zone > Zone > Edit"
    echo "   - Permissions: Zone > DNS > Edit"
    echo "4. Copie o token gerado"
    echo ""
    echo "💡 Uso: ./add-domain-to-cloudflare.sh <SEU_API_TOKEN>"
    exit 1
fi

echo "🚀 Adicionando domínio $DOMAIN ao Cloudflare..."
echo ""

# Adicionar zona ao Cloudflare
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     --data "{
       \"account\": {
         \"id\": \"$ACCOUNT_ID\"
       },
       \"name\": \"$DOMAIN\",
       \"type\": \"full\"
     }")

# Verificar se foi bem sucedido
SUCCESS=$(echo $RESPONSE | grep -o '"success":[^,]*' | grep -o '[^:]*$')

if [ "$SUCCESS" = "true" ]; then
    echo "✅ Domínio adicionado com sucesso!"
    echo ""

    # Extrair nameservers
    echo "📋 Nameservers do Cloudflare:"
    echo $RESPONSE | grep -o '"name_servers":\[.*\]' | sed 's/.*\[\(.*\)\].*/\1/' | tr ',' '\n' | sed 's/"//g' | while read ns; do
        echo "   - $ns"
    done

    echo ""
    echo "📌 Próximos passos:"
    echo "1. Acesse GoDaddy: https://dcc.godaddy.com/domains"
    echo "2. Selecione fitpro.vip"
    echo "3. Clique em 'DNS' > 'Nameservers' > 'Change'"
    echo "4. Selecione 'Custom' e adicione os nameservers acima"
    echo "5. Aguarde 24-48h para propagação completa"
    echo ""
    echo "🔍 Verificar propagação: https://www.whatsmydns.net/#NS/$DOMAIN"

else
    echo "❌ Erro ao adicionar domínio:"
    echo $RESPONSE | grep -o '"message":"[^"]*"' || echo $RESPONSE
    exit 1
fi
