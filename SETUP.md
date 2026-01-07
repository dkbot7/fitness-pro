# Fitness Pro - Setup Guide

## [OK] Aplicação já está rodando!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8787

## 🔑 Configuração de Autenticação (Clerk)

### Modo Atual: Keyless Mode

A aplicação está rodando em **keyless mode** do Clerk, que permite testar sem configurar chaves.

### Para configurar chaves permanentes:

1. **Claim your keys** (link no console do Next.js) ou acesse:
   https://dashboard.clerk.com/

2. Crie uma aplicação no Clerk Dashboard

3. Copie as chaves e adicione em `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   ```

4. Copie a secret key para `apps/api/.dev.vars`:
   ```env
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```

5. Reinicie os servidores

## 🗄️ Configuração do Banco de Dados (Neon)

### Para testar a aplicação completa:

1. Crie uma conta em: https://neon.tech/ (free tier)

2. Crie um novo projeto chamado "fitness-pro"

3. Copie a connection string e adicione em `apps/api/.dev.vars`:
   ```env
   DATABASE_URL=postgres://user:password@ep-xxxxx.us-east-2.aws.neon.tech/fitness_pro?sslmode=require
   ```

4. Execute as migrations:
   ```bash
   cd packages/database
   pnpm run db:push
   ```

5. Popule os exercícios:
   ```bash
   pnpm run db:seed
   ```

## 🎯 Testando a Aplicação

### Sem Banco de Dados (apenas UI):
- Navegue pela interface
- Teste o onboarding (não salvará dados)
- Veja os componentes e layout

### Com Banco de Dados:
1. Complete o onboarding em: http://localhost:3000/onboarding
2. Veja seu plano de treino em: http://localhost:3000/plano
3. Execute um treino clicando em "Iniciar treino"
4. Use o cronômetro e marque as séries concluídas
5. Conclua o treino e veja as estatísticas

## 📁 Arquivos de Configuração

- `apps/web/.env.local` - Variáveis do Next.js (frontend)
- `apps/api/.dev.vars` - Variáveis do Cloudflare Workers (backend)
- `.env.example` - Template com todas as variáveis

## 🚀 Comandos Úteis

```bash
# Ver processos rodando
/tasks

# Parar servidores (se necessário)
# Use Ctrl+C nos terminais ou kill os processos

# Reiniciar frontend
cd apps/web && pnpm run dev

# Reiniciar backend
cd apps/api && pnpm run dev -- --no-bundle

# Build para produção
pnpm run build
```

## 📝 Próximos Passos

Segundo o plano de 6 semanas:

[OK] **Week 1**: Foundation & Setup - COMPLETO
[OK] **Week 2**: Onboarding Flow - COMPLETO
[OK] **Week 3**: Workout Display & Execution - COMPLETO
🔜 **Week 4**: Feedback & Adjustment (próximo)

Week 4 implementará:
- Formulário de feedback pós-treino (Fácil/Ok/Difícil)
- Algoritmo de ajuste semanal automático
- Cloudflare Cron Triggers para geração de planos
