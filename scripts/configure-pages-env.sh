#!/bin/bash

# Script para configurar variáveis de ambiente no Cloudflare Pages
# Usa a API do Cloudflare diretamente

ACCOUNT_ID="ce11d202b2917777965b5131b5edc627"
PROJECT_NAME="fitness-pro"

# Obter token via wrangler
echo "🔑 Verificando autenticação..."
cd ../apps/web
npx wrangler whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
  echo "❌ Erro: Não autenticado no Wrangler"
  exit 1
fi

echo "✅ Autenticado"
echo ""
echo "📝 Configurando variáveis de ambiente no Cloudflare Pages..."
echo "   Projeto: $PROJECT_NAME"
echo "   Account: $ACCOUNT_ID"
echo ""

# Criar arquivo de configuração de variáveis
cat > /tmp/pages-env-vars.json <<'EOF'
{
  "deployment_configs": {
    "production": {
      "env_vars": {
        "NODE_VERSION": {
          "type": "plain_text",
          "value": "20"
        },
        "NEXT_PUBLIC_API_URL": {
          "type": "plain_text",
          "value": "https://api.fitpro.vip"
        },
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": {
          "type": "plain_text",
          "value": "pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM"
        },
        "NEXT_PUBLIC_CLERK_SIGN_IN_URL": {
          "type": "plain_text",
          "value": "/login"
        },
        "NEXT_PUBLIC_CLERK_SIGN_UP_URL": {
          "type": "plain_text",
          "value": "/register"
        },
        "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL": {
          "type": "plain_text",
          "value": "/"
        },
        "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL": {
          "type": "plain_text",
          "value": "/onboarding"
        }
      }
    }
  }
}
EOF

echo "📄 Arquivo de configuração criado"
echo ""
echo "⚠️  ATENÇÃO: A API do Cloudflare Pages para environment variables"
echo "   requer autenticação via API Token, não OAuth."
echo ""
echo "📋 Para configurar via dashboard:"
echo ""
echo "1. Acesse: https://dash.cloudflare.com/$ACCOUNT_ID/pages/view/$PROJECT_NAME/settings/environment-variables"
echo ""
echo "2. Clique em 'Add variable' e adicione cada uma:"
echo ""
echo "   NODE_VERSION = 20"
echo "   NEXT_PUBLIC_API_URL = https://api.fitpro.vip"
echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_OyGg3O6tZ4N3lQRN9ZL7Iwqyq4mr4p6Q2JnoJQqhoM"
echo "   NEXT_PUBLIC_CLERK_SIGN_IN_URL = /login"
echo "   NEXT_PUBLIC_CLERK_SIGN_UP_URL = /register"
echo "   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /"
echo "   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /onboarding"
echo ""
echo "3. Clique em 'Save' após cada variável"
echo ""
echo "4. Faça novo deployment:"
echo "   git commit --allow-empty -m 'chore: Trigger rebuild'"
echo "   git push origin main"
echo ""

# Cleanup
rm -f /tmp/pages-env-vars.json

echo "✅ Guia exibido com sucesso"
