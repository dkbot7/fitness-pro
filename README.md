# FitPro - Personal Trainer Digital

**Personal trainer digital em português para brasileiros no exterior**

Um SaaS de treinamento físico que gera planos de treino personalizados e se adapta automaticamente baseado no feedback do usuário.

## 🌐 Deploy em Produção

**URL:** https://fitpro.vip

**Status:** ✅ 100% Funcional em Produção

## 🎯 Proposta de Valor

"Um personal trainer digital em português que monta e ajusta seu treino automaticamente"

## ✨ Features Principais

### 🎯 Onboarding Inteligente
- Multi-step form com validação Zod
- Seleção de objetivo (emagrecer/ganhar massa/manter)
- Frequência de treino (2-6x/semana)
- Equipamentos disponíveis (casa ou academia)
- Limitações físicas (lesões, dores)

### 📊 Geração Automática de Planos
- **Algoritmo baseado em regras** (sem ML)
- Splits inteligentes por frequência:
  - 2x/semana: Full Body
  - 3x/semana: Upper/Lower/Full
  - 4x/semana: Upper/Lower
  - 5-6x/semana: Push/Pull/Legs
- Volume adaptado por objetivo (sets/reps/rest)
- Seleção de exercícios por equipamento disponível

### 📈 Ajuste Semanal Automático (Progressive Overload)
- Coleta de feedback após cada treino (Fácil/Ok/Difícil)
- Ajuste automático toda segunda-feira (Cron Trigger)
- **60%+ fácil → +10% volume**
- **60%+ difícil → -10% volume**
- Mínimo 3 feedbacks para ajustar
- Troca de 2 exercícios a cada 4 semanas (variedade)

### 📱 PWA (Progressive Web App)
- Instalável em mobile e desktop
- Funciona offline (service worker)
- Prompt de instalação inteligente (30s delay)
- Manifest em português

### 🏆 Gamificação
- Sistema de conquistas (badges)
- Sequência de treinos (streaks)
- Níveis de raridade (comum, raro, épico, lendário)
- Progresso visual e motivação

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend:** Vite 6 + React 19 + TypeScript + React Router
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend API:** Cloudflare Workers + Hono
- **Database:** Neon Postgres (serverless)
- **ORM:** Drizzle ORM
- **Auth:** Clerk (PT-BR)
- **Hosting:** Cloudflare Pages
- **PWA:** vite-plugin-pwa

### Por que Vite ao invés de Next.js?

O projeto foi migrado de Next.js para Vite para:
- ✅ Compatibilidade nativa com Cloudflare Pages
- ✅ Build mais rápido (~6s vs ~20s)
- ✅ Bundle menor (316 KB gzipped)
- ✅ Sem necessidade de adaptadores (OpenNext)
- ✅ Stack mais simples e direta

## 📁 Estrutura do Projeto

```
fitness_pro/
├── apps/
│   ├── web/            # Vite + React + React Router (Cloudflare Pages)
│   │   ├── src/
│   │   │   ├── main.tsx           # Entry point
│   │   │   ├── App.tsx            # Router config
│   │   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── components/        # Componentes reutilizáveis
│   │   │   └── layouts/           # Layouts (Dashboard, etc)
│   │   ├── public/
│   │   │   ├── _headers           # Security headers
│   │   │   ├── _redirects         # SPA redirects
│   │   │   ├── robots.txt         # SEO
│   │   │   └── sitemap.xml        # SEO
│   │   └── vite.config.ts
│   └── api/            # Hono API (Cloudflare Workers)
├── packages/
│   ├── database/       # Drizzle schema + migrations
│   └── shared/         # Types, constants, 30 exercícios catalogados
└── scripts/            # Seed scripts
```

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9
- Git

### 1. Clonar e Instalar

```bash
git clone https://github.com/dkbot7/fitness-pro.git
cd fitness_pro
pnpm install
```

### 2. Configurar Variáveis de Ambiente

#### Apps/Web (.env.local)
```bash
cd apps/web
cp .env.example .env.local
```

Edite `.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:8787
```

#### Apps/API (.dev.vars)
```bash
cd apps/api
cp .dev.vars.example .dev.vars
```

Edite `.dev.vars`:
```env
DATABASE_URL=postgres://user:pass@host/db
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 3. Configurar Database

```bash
cd packages/database

# Gerar migrations
pnpm db:generate

# Aplicar migrations
pnpm db:migrate

# (Opcional) Seed de exercícios
pnpm seed
```

### 4. Rodar em Desenvolvimento

```bash
# Na raiz - roda web + api simultaneamente
pnpm dev

# Ou separadamente:
pnpm --filter @fitness-pro/web dev     # http://localhost:3000
pnpm --filter @fitness-pro/api dev     # http://localhost:8787
```

## 📦 Deploy em Produção

### Deploy Frontend (Cloudflare Pages)

O deploy é **automático** via GitHub:

1. Push para branch `main`
2. Cloudflare Pages faz build automaticamente
3. Site atualizado em ~2-3 minutos

**Ou deploy manual:**

```bash
cd apps/web
rm -rf dist
pnpm build
npx wrangler pages deploy dist --project-name=fitness-pro --commit-dirty=true
```

**Importante:** Para usar chaves de produção do Clerk, veja `DEPLOY_PRODUCTION.md`

### Deploy API (Cloudflare Workers)

```bash
cd apps/api
pnpm deploy
```

### Documentação de Deploy

- **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)** - Guia completo de deploy em produção
- **[CLI_CONFIG_SUMMARY.md](./CLI_CONFIG_SUMMARY.md)** - Configuração via CLI do Cloudflare

## 📖 Documentação Adicional

### Documentos Principais
- **[PRODUCAO_COMPLETA_2026.md](./PRODUCAO_COMPLETA_2026.md)** - Checklist completo de produção
- **[SETUP.md](./SETUP.md)** - Guia detalhado de setup local
- **[USER_JOURNEY.md](./USER_JOURNEY.md)** - Jornada do usuário
- **[BRAND_KIT_INVENTORY.md](./BRAND_KIT_INVENTORY.md)** - Assets e branding

### Histórico de Sprints
- **[SPRINT1_SUMMARY.md](./SPRINT1_SUMMARY.md)** - Foundation & Setup
- **[SPRINT2_SUMMARY.md](./SPRINT2_SUMMARY.md)** - Core Features
- **[SPRINT2_PLAN.md](./SPRINT2_PLAN.md)** - Planejamento Sprint 2
- **[SPRINT3_SUMMARY.md](./SPRINT3_SUMMARY.md)** - Polish & Launch

## 🗄️ Database

### Comandos Drizzle

```bash
cd packages/database

# Gerar migration após mudar schema
pnpm db:generate

# Aplicar migrations
pnpm db:migrate

# Push direto (dev only)
pnpm db:push

# Drizzle Studio (GUI)
pnpm db:studio
```

## 🧪 Scripts Disponíveis

### Frontend (apps/web)

```bash
cd apps/web

# Desenvolvimento
pnpm dev                    # Vite dev server (porta 3000)

# Build
pnpm build                  # Build para produção

# Preview
pnpm start                  # Preview do build localmente

# Deploy manual
pnpm cf-deploy              # Build + deploy Cloudflare Pages

# PWA
pnpm generate-icons         # Gerar ícones PWA do SVG

# Linting
pnpm lint                   # ESLint
pnpm format                 # Prettier
```

### API (apps/api)

```bash
cd apps/api

# Desenvolvimento
pnpm dev                    # Wrangler dev (porta 8787)

# Deploy
pnpm deploy                 # Deploy para Cloudflare Workers

# Tipos
pnpm types                  # Gerar tipos do Drizzle
```

## 🔒 Segurança

### Security Headers

Implementados via `apps/web/public/_headers`:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: Configurado
- Referrer-Policy: strict-origin-when-cross-origin

### SSL/TLS

- ✅ Cloudflare Universal SSL
- ✅ Always HTTPS
- ✅ Grade A+

## 🔍 SEO

### Implementado

- ✅ Meta tags completas (title, description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ robots.txt → https://fitpro.vip/robots.txt
- ✅ sitemap.xml → https://fitpro.vip/sitemap.xml
- ✅ Canonical URLs

## 📱 PWA Features

- ✅ Manifest.json em português
- ✅ Service Worker com cache strategy
- ✅ Offline support
- ✅ Instalável (Android, iOS, Desktop)
- ✅ Icons completos (192, 512, Apple, favicons)
- ✅ Auto-update

## 📊 Status do Projeto

### ✅ Completo (Week 1-5)
- [x] Setup monorepo
- [x] Schema database completo
- [x] Onboarding flow (4 passos)
- [x] Geração automática de planos
- [x] Workout display & execution
- [x] Timer de descanso
- [x] Sistema de feedback
- [x] Ajuste semanal automático (cron)
- [x] PWA completo
- [x] Perfil de usuário
- [x] Sistema de gamificação
- [x] Landing page premiada
- [x] Deploy em produção

### 🔄 Week 6: Polish & Launch (Em Progresso)
- [x] Error boundaries
- [x] 404 customizada
- [x] Security headers
- [x] SEO (robots.txt, sitemap)
- [x] Production deployment
- [ ] Analytics integration (PostHog)
- [ ] Error monitoring (Sentry)
- [ ] E2E testing

## 💰 Custo Mensal

**Para < 1000 usuários:** $0-5/mês

- **Cloudflare Pages:** Free (Unlimited requests)
- **Cloudflare Workers:** Free (100k requests/day)
- **Neon Postgres:** Free (0.5GB)
- **Clerk:** Free (10k MAU)

## 🎯 Métricas de Sucesso (MVP)

- **Week 1-2**: 50%+ onboarding completion
- **Week 3-4**: 30%+ completam 3+ treinos/semana
- **D7 retention**: 40%+
- **D30 retention**: 20%+

## 📚 Links Úteis

### Produção
- **Site:** https://fitpro.vip
- **API:** https://api.fitpro.vip
- **Cloudflare Dashboard:** https://dash.cloudflare.com/pages/view/fitness-pro
- **GitHub:** https://github.com/dkbot7/fitness-pro

### Ferramentas
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Neon Console:** https://console.neon.tech
- **Drizzle Studio:** `pnpm db:studio` (local)

### Documentação Técnica
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Clerk](https://clerk.com/docs)

## 🤝 Contribuindo

Este é um projeto MVP focado em validação rápida de mercado.

## 📄 Licença

Privado - Todos os direitos reservados

---

**Última atualização:** 06/01/2026
**Status:** ✅ Produção - 100% Funcional
