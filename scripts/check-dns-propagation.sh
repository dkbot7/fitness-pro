#!/bin/bash
# Script para verificar propagação DNS do fitpro.vip

DOMAIN="fitpro.vip"

echo "🔍 Verificando propagação DNS para $DOMAIN..."
echo ""

# Verificar nameservers
echo "📋 Nameservers atuais:"
nslookup -type=NS $DOMAIN | grep "nameserver" || echo "Ainda usando nameservers antigos..."

echo ""
echo "✅ Nameservers esperados do Cloudflare:"
echo "   - luciana.ns.cloudflare.com"
echo "   - rustam.ns.cloudflare.com"

echo ""
echo "🌐 Verificar propagação global:"
echo "   https://www.whatsmydns.net/#NS/$DOMAIN"

echo ""
echo "⏰ Status:"
if nslookup -type=NS $DOMAIN | grep -q "cloudflare"; then
    echo "   ✅ DNS PROPAGADO! Cloudflare está ativo."
    echo ""
    echo "🎯 Próximos passos:"
    echo "   1. Acessar: https://dash.cloudflare.com"
    echo "   2. Selecionar fitpro.vip"
    echo "   3. Ir em DNS > Records"
    echo "   4. Configurar registros para Pages e Workers"
else
    echo "   ⏳ Aguardando propagação..."
    echo "   Tente novamente em 15 minutos"
fi
