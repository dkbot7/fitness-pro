# Guia de Deploy - Fitness Pro MVP

Este guia cobre o deployment completo da aplicação Fitness Pro em produção usando Cloudflare Pages e Workers.

## 📋 Checklist Pré-Deploy

- [ ] Banco de dados Neon configurado (free tier)
- [ ] Conta Clerk configurada com domínio de produção
- [ ] Conta Cloudflare configurada
- [ ] Variáveis de ambiente configuradas
- [ ] 30 exercícios populados no banco
- [ ] Testes manuais completados

## 🗄️ 1. Setup do Banco de Dados (Neon)

### 1.1 Criar Database

```bash
# Acesse https://console.neon.tech/
# Crie novo projeto: "fitness-pro"
# Copie a connection string
```

### 1.2 Executar Migrations

```bash
cd packages/database
pnpm run db:push
```

### 1.3 Popular Exercícios

```bash
# Na raiz do projeto
pnpm run db:seed
```

Verifique se os 30 exercícios foram inseridos:

```sql
SELECT COUNT(*) FROM exercises;
-- Deve retornar: 30
```

## 🔐 2. Configurar Clerk

### 2.1 Criar Aplicação

1. Acesse https://dashboard.clerk.com/
2. Crie nova aplicação: "Fitness Pro Production"
3. Habilite Email/Password auth
4. Configure localização: Portuguese (Brazil)

### 2.2 Configurar Domínios

```
Production URL: https://seu-dominio.com
Development URL: http://localhost:3000
```

### 2.3 Configurar Redirects

```
After sign in: /
After sign up: /onboarding
Sign in URL: /login
Sign up URL: /register
```

### 2.4 Copiar Chaves

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
```

## ☁️ 3. Deploy do Frontend (Cloudflare Pages)

### 3.1 Via Dashboard (Recomendado)

1. Acesse https://dash.cloudflare.com/
2. Pages > Create a project
3. Conecte seu repositório GitHub
4. Configure build:

```
Framework preset: Next.js
Build command: pnpm run build
Build output directory: apps/web/.next
Root directory: apps/web
Node version: 20
```

### 3.2 Variáveis de Ambiente

No Cloudflare Pages > Settings > Environment Variables:

**Production:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NODE_VERSION=20
```

### 3.3 Deploy

```bash
# Via CLI (alternativa)
cd apps/web
pnpm run build
npx wrangler pages deploy .next --project-name=fitness-pro
```

## 🔧 4. Deploy do Backend (Cloudflare Workers)

### 4.1 Configurar wrangler.toml

```toml
name = "fitness-pro-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "fitness-pro-api-production"
routes = [
  { pattern = "api.seu-dominio.com/*", zone_name = "seu-dominio.com" }
]

[observability]
enabled = true

[triggers]
crons = ["0 6 * * 1"] # Segunda-feira 6am UTC
```

### 4.2 Adicionar Secrets

```bash
cd apps/api

# Database
echo "YOUR_NEON_CONNECTION_STRING" | wrangler secret put DATABASE_URL --env production

# Clerk
echo "YOUR_CLERK_SECRET" | wrangler secret put CLERK_SECRET_KEY --env production
```

### 4.3 Deploy

```bash
cd apps/api
pnpm run deploy
```

Verifique no dashboard:
```
https://dash.cloudflare.com/ > Workers & Pages
```

## 🌐 5. Configurar Domínio Customizado

### 5.1 Para Pages (Frontend)

```
Cloudflare Pages > Custom Domains
Adicionar: www.seu-dominio.com
Adicionar: seu-dominio.com (redirect para www)
```

### 5.2 Para Workers (API)

```
Cloudflare Workers > Settings > Triggers
Adicionar rota: api.seu-dominio.com/*
```

## 🧪 6. Testes Pós-Deploy

### 6.1 Health Check

```bash
curl https://api.seu-dominio.com/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

### 6.2 Teste Completo do Fluxo

1. Acesse https://seu-dominio.com
2. Crie uma conta
3. Complete o onboarding
4. Verifique se o plano foi gerado (Week 1)
5. Inicie um treino
6. Complete o treino
7. Envie feedback
8. Verifique perfil

### 6.3 Teste de PWA

1. Acesse no mobile
2. "Add to Home Screen"
3. Abra o app instalado
4. Teste navegação offline

## 📊 7. Monitoramento

### 7.1 Cloudflare Analytics

```
Workers > Analytics
Pages > Analytics
```

Métricas importantes:
- Requests por dia
- Error rate
- P50/P95/P99 latency
- Bandwidth usage

### 7.2 Logs

```bash
# Ver logs em tempo real
wrangler tail --env production

# Filtrar por erro
wrangler tail --env production --status error
```

### 7.3 Cron Triggers

Verifique se o cron semanal está funcionando:

```bash
# Trigger manualmente para testar
wrangler dev --test-scheduled

# Ou via dashboard:
Workers > Cron Triggers > Manage Cron Triggers
```

## 🔒 8. Segurança

### 8.1 CORS

Verifique em `apps/api/src/index.ts`:

```typescript
cors({
  origin: [
    'https://seu-dominio.com',
    'https://www.seu-dominio.com'
  ],
  credentials: true,
})
```

### 8.2 Rate Limiting (Opcional)

Adicione no Cloudflare Dashboard:
```
Security > WAF > Rate limiting rules
```

Exemplo:
- Max 100 requests/min por IP
- Max 20 onboardings/hour por IP

### 8.3 Headers de Segurança

Adicione em `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];
},
```

## 💰 9. Estimativa de Custos (< 1000 usuários)

| Serviço | Free Tier | Custo Estimado |
|---------|-----------|----------------|
| Cloudflare Pages | 500 builds/mês | $0 |
| Cloudflare Workers | 100k requests/dia | $0 |
| Cloudflare R2 | 10GB storage | $0 |
| Neon Postgres | 0.5GB, 100 conexões | $0 |
| Clerk | 10k MAU | $0 |
| **Total** | | **$0-5/mês** |

## 🚨 10. Troubleshooting

### Build Failed no Pages

```bash
# Limpar cache
rm -rf .next node_modules
pnpm install
pnpm run build
```

### Worker 500 Error

```bash
# Ver logs
wrangler tail --env production

# Verificar secrets
wrangler secret list --env production
```

### Database Connection Error

```bash
# Testar conexão
psql "YOUR_CONNECTION_STRING"

# Verificar IP whitelist no Neon
# (Cloudflare Workers usa IPs dinâmicos - deve aceitar qualquer IP)
```

### PWA não instala

1. Verifique HTTPS habilitado
2. Verifique `manifest.json` acessível
3. Verifique service worker registrado
4. Use Chrome DevTools > Application > Manifest

## 📝 11. Rollback

### Rollback do Frontend

```bash
# Via dashboard
Cloudflare Pages > Deployments > Previous deployment > Rollback

# Via CLI
cd apps/web
git checkout <commit-anterior>
pnpm run build
npx wrangler pages deploy .next
```

### Rollback do Backend

```bash
cd apps/api
git checkout <commit-anterior>
pnpm run deploy
```

## [OK] 12. Checklist Final

- [ ] Frontend acessível via HTTPS
- [ ] API respondendo via HTTPS
- [ ] Clerk funcionando (login/register)
- [ ] Onboarding gerando plano
- [ ] Treinos exibindo corretamente
- [ ] Feedback salvando no banco
- [ ] PWA instalável
- [ ] Cron trigger configurado
- [ ] Logs sem erros críticos
- [ ] Performance < 3s (First Contentful Paint)
- [ ] Mobile responsivo
- [ ] Analytics configurado

## 🎉 13. Pós-Deploy

### Soft Launch

1. Compartilhe com 5-10 beta users
2. Colete feedback via forms
3. Monitore analytics diariamente
4. Ajuste baseado em uso real

### Metrics to Track

- **D1 Retention**: Quantos voltam no dia seguinte?
- **D7 Retention**: Quantos completam Week 1?
- **Onboarding completion**: % que completam
- **Workouts/week**: Média de treinos por usuário
- **Feedback rate**: % que dão feedback

### Próximos Passos

- [ ] Adicionar vídeos aos 30 exercícios (Week 5)
- [ ] Integrar analytics (PostHog/Sentry)
- [ ] Adicionar mais exercícios (30 → 50)
- [ ] Implementar planos pagos (Stripe)
- [ ] App mobile (React Native)

---

**Documentação criada em**: Janeiro 2026
**Versão**: 1.0.0 (MVP)
**Última atualização**: Deploy inicial
