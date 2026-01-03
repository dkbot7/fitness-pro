# Fitness Pro MVP

**Personal trainer digital em português para brasileiros no exterior**

Um SaaS de treinamento físico que gera planos de treino personalizados e se adapta automaticamente baseado no feedback do usuário.

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

### 🎨 UX/UI
- Design mobile-first responsivo
- Toast notifications para feedback
- Error boundaries em todas as páginas
- 404 customizada com links úteis
- Timer de descanso com presets (30s, 1min, 1:30, 2min)

## 🏗️ Arquitetura

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router) + OpenNext para Cloudflare Workers
- **Backend**: Cloudflare Workers + Hono
- **Database**: Neon Postgres (serverless)
- **ORM**: Drizzle ORM
- **Auth**: Clerk (PT-BR)
- **Storage**: Cloudflare R2 (vídeos de exercícios)

## 📁 Estrutura do Projeto

```
fitness_pro/
├── apps/
│   ├── web/            # Next.js 15 + OpenNext (Cloudflare Workers)
│   └── api/            # Hono API (Cloudflare Workers)
├── packages/
│   ├── database/       # Drizzle schema + migrations
│   └── shared/         # Types, constants, 30 exercícios catalogados
└── scripts/            # Seed scripts
```

## 🚀 Setup Inicial

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9
- Git

### 1. Clonar e Instalar

```bash
git clone <seu-repo>
cd fitness_pro
pnpm install
```

### 2. Criar Contas (Free Tier)

#### Clerk (Autenticação)
1. Acesse https://clerk.com
2. Crie uma conta e um novo aplicativo
3. Configure **Localização: PT-BR**
4. Copie as credenciais:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

#### Neon (Database)
1. Acesse https://console.neon.tech
2. Crie um novo projeto
3. Copie a `DATABASE_URL` (connection string)

#### Cloudflare
1. Acesse https://dash.cloudflare.com
2. Crie uma conta (se não tiver)
3. Copie:
   - `CLOUDFLARE_ACCOUNT_ID`
   - Crie um API Token com permissões Workers

### 3. Configurar Variáveis de Ambiente

#### Apps/Web (.env.local)
```bash
cd apps/web
cp ../../.env.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_API_URL=http://localhost:8787
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

### 4. Configurar Database

```bash
# Na raiz do projeto
cd packages/database

# Gerar migrations
pnpm db:generate

# Aplicar migrations no Neon
pnpm db:migrate
```

### 5. Seed dos 30 Exercícios

```bash
# Criar script de seed (próxima task)
pnpm --filter @fitness-pro/database seed
```

## 💻 Desenvolvimento

### Rodar Todos os Apps (Turborepo)

```bash
# Na raiz
pnpm dev
```

Isso inicia:
- **Web**: http://localhost:3000
- **API**: http://localhost:8787

### Rodar Individualmente

```bash
# Next.js
pnpm --filter @fitness-pro/web dev

# API
pnpm --filter @fitness-pro/api dev
```

### Testar Localmente

1. **Criar conta**: http://localhost:3000/register
2. **Completar onboarding**: 4 passos (objetivo, frequência, equipamento, limitações)
3. **Ver plano gerado**: http://localhost:3000/plano
4. **Iniciar treino**: Clique em um workout
5. **Completar treino**: Use o timer e marque como concluído
6. **Dar feedback**: Escolha dificuldade (Fácil/Ok/Difícil)
7. **Ver perfil**: http://localhost:3000/perfil

## 📖 Documentação Adicional

- **[SETUP.md](./SETUP.md)**: Guia detalhado de setup local
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Guia completo de deploy em produção
  - Configuração Neon Database
  - Setup Clerk produção
  - Deploy Cloudflare Pages + Workers
  - Monitoramento e troubleshooting

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

## 📦 Deploy

### Frontend (Cloudflare Workers via OpenNext)

```bash
cd apps/web

# Build com OpenNext
pnpm build

# Deploy
pnpm cf-deploy
```

### API (Cloudflare Workers)

```bash
cd apps/api

# Deploy
pnpm deploy
```

## 🧪 Testing

```bash
# Lint
pnpm lint

# Format
pnpm format
```

## 📚 Recursos

### Documentação Oficial
- [Turborepo](https://turbo.build/repo/docs)
- [Next.js 15](https://nextjs.org/docs)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Clerk](https://clerk.com/docs)
- [Neon](https://neon.tech/docs)

### Stack
- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15 + Tailwind + shadcn/ui
- **Backend**: Cloudflare Workers + Hono
- **ORM**: Drizzle
- **DB**: Neon Postgres (serverless, free 0.5GB)
- **Auth**: Clerk (free 10k MAU)
- **Storage**: Cloudflare R2 (free 10GB)

## 📊 Progresso do MVP (6 Semanas)

### ✅ Week 1: Foundation & Setup (Completo)
- [x] Setup monorepo (Turborepo + pnpm)
- [x] Criar apps (web + api)
- [x] Criar packages (database + shared)
- [x] Definir 30 exercícios catalogados
- [x] Configurar Clerk no Next.js (PT-BR)
- [x] Criar middleware de auth (Clerk JWT)
- [x] Configurar shadcn/ui + Tailwind
- [x] Criar schema Drizzle completo
- [x] Criar seed script para exercícios

### ✅ Week 2: Onboarding Flow (Completo)
- [x] Multi-step onboarding form (4 passos)
- [x] Validação com React Hook Form + Zod
- [x] POST /api/onboarding endpoint
- [x] Algoritmo de geração de plano inicial
- [x] Seleção inteligente de exercícios por equipamento
- [x] Volume por objetivo (sets/reps/rest)

### ✅ Week 3: Workout Display & Execution (Completo)
- [x] GET /api/training/plan endpoint
- [x] Weekly plan view com estatísticas
- [x] Workout detail page
- [x] ExerciseCard component
- [x] WorkoutTimer com countdown
- [x] POST /api/training/complete endpoint
- [x] TanStack Query + optimistic updates

### ✅ Week 4: Feedback & Adjustment (Completo)
- [x] Feedback page (Fácil/Ok/Difícil)
- [x] POST /api/feedback endpoint
- [x] Algoritmo de ajuste semanal (±10%)
- [x] Cloudflare Cron Trigger (Segunda 6am UTC)
- [x] Progressive overload implementation
- [x] Troca de exercícios a cada 4 semanas

### ✅ Week 5: PWA & Profile (Completo)
- [x] Configurar next-pwa
- [x] Manifest.json em português
- [x] Service worker + offline support
- [x] Profile page (GET /me, PUT /me/profile)
- [x] Translations PT-BR completas
- [x] Mobile-first responsive design

### 🔄 Week 6: Polish, Testing & Launch (Em Progresso)
- [x] Error boundaries (error.tsx)
- [x] 404 page customizada
- [x] PWA install prompt component
- [x] Toast notifications support
- [x] DEPLOYMENT.md guide completo
- [ ] Loading states em todas as páginas
- [ ] Analytics integration (PostHog)
- [ ] Error monitoring (Sentry)
- [ ] End-to-end testing completo
- [ ] Production deployment

## 🎯 Métricas de Sucesso (MVP)

- **Week 1-2**: 50%+ onboarding completion, 10+ beta users
- **Week 3-4**: 30%+ completam 3+ treinos/semana, D7 retention 40%+
- **Week 5-6**: D30 retention 20%+, 5+ users atingem Week 3

## 💰 Custo Estimado

- **Cloudflare Workers**: Free (100k requests/day)
- **Cloudflare R2**: Free (10GB)
- **Neon Postgres**: Free (0.5GB)
- **Clerk**: Free (10k MAU)
- **PostHog** (analytics): Free (1M events/month)

**Total**: $0-5/mês para <1000 usuários

## 🤝 Contribuindo

Este é um projeto MVP. Foco total em validação rápida.

## 📄 Licença

Privado - Todos os direitos reservados
