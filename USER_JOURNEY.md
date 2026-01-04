# Jornada do Usuário - Fitness Pro

**Data da Análise**: 04/01/2026
**Versão**: 1.0.0 (MVP)

---

## 📊 Visão Geral da Jornada

```
Landing Page → Registro → Onboarding (4 etapas) → Plano Gerado →
Execução de Treino → Feedback → Ajuste Semanal → Progressão
```

**Tempo estimado total**: 10-15 minutos (primeiro acesso)
**Taxa de conversão esperada**: 50-60% (landing → onboarding completo)

---

## 🎯 FASE 1: Descoberta e Aquisição

### Landing Page (`/`)

**Arquivo**: `apps/web/src/app/page.tsx`

#### Primeira Impressão

**Para usuários não autenticados**:
- ✅ Hero Section clara com proposta de valor
- ✅ Título impactante: "Fitness Pro - Seu personal trainer digital em português"
- ✅ Subtítulo: "Treinos personalizados que se adaptam automaticamente ao seu progresso"
- ✅ CTAs duplos: "Entrar" + "Criar conta grátis"
- ✅ Acesso rápido ao dashboard (mesmo sem autenticação)

**Para usuários autenticados**:
- ✅ Mensagem de boas-vindas personalizada
- ✅ Avatar do usuário (Clerk UserButton)
- ✅ Acesso direto ao plano de treino
- ✅ Opção de reconfigurar preferências

#### Features Grid (6 Cards)

1. **Personalizado** 🎯
   - Planos para emagrecer, ganhar massa ou manter forma

2. **Adaptativo** 📈
   - Ajuste automático semanal baseado em feedback

3. **Completo** 💪
   - 30+ exercícios com instruções em PT

4. **Casa ou Academia** 🏠
   - Adaptado ao equipamento disponível

5. **Flexível** ⏱️
   - 2 a 6 treinos por semana

6. **Em Português** 🇧🇷
   - Especial para brasileiros no exterior

#### "Como Funciona" (5 Passos)

1. Complete o Onboarding
2. Receba seu Plano Personalizado
3. Execute os Treinos
4. Dê Feedback
5. Evolua Automaticamente

#### CTAs Finais

- Card destacado em azul
- "Pronto para começar?"
- Duplo CTA: "Começar agora" + "Já tenho conta"

### 🎨 Análise de UX - Landing Page

**Pontos Fortes**:
- ✅ Proposta de valor cristalina
- ✅ Social proof implícito (PT-BR focus)
- ✅ Duplos CTAs em locais estratégicos
- ✅ Explicação clara do processo (5 passos)
- ✅ Design mobile-first responsivo
- ✅ Sem bloqueio de conteúdo (pode ver sem criar conta)

**Pontos de Melhoria**:
- ⚠️ Falta prova social (testemunhos, número de usuários)
- ⚠️ Sem screenshots/preview do app
- ⚠️ Linha 36: Link "Ir para Dashboard" está indo para `/onboarding` (confuso para não-autenticados)
- ⚠️ Falta senso de urgência ou escassez
- ⚠️ Sem captura de email antes do registro (lead magnet)

**Recomendações**:
```typescript
// Linha 36 - Corrigir link
<Link href="/onboarding">Ir para Dashboard →</Link>
// Deveria ser:
<Link href="/plano">Ver exemplo de plano →</Link>
// Ou remover completamente para não-autenticados
```

---

## 🔐 FASE 2: Autenticação

### Registro (`/register`)

**Arquivo**: `apps/web/src/app/register/[[...sign-up]]/page.tsx`

#### Componente

- ✅ Usa `<SignUp />` do Clerk
- ✅ Design customizado (shadow-xl)
- ✅ Link para login: `/login`
- ✅ Redirecionamento pós-registro: `/onboarding`

#### Fluxo Clerk

1. Email + senha
2. Verificação de email (Clerk gerencia)
3. Criação de conta
4. Redirect automático → `/onboarding`

### Login (`/login`)

**Arquivo**: `apps/web/src/app/login/[[...sign-in]]/page.tsx`

#### Componente

- ✅ Usa `<SignIn />` do Clerk
- ✅ Link para registro: `/register`
- ✅ Redirecionamento pós-login: `/` (home)

### 🎨 Análise de UX - Autenticação

**Pontos Fortes**:
- ✅ Clerk gerencia toda complexidade (email verification, password reset)
- ✅ UI consistente e profissional
- ✅ Localização em PT-BR (configurado no Clerk)
- ✅ Social logins disponíveis (Google, GitHub via Clerk)

**Pontos de Melhoria**:
- ⚠️ Login redireciona para `/` ao invés de `/plano` (perda de foco)
- ⚠️ Sem onboarding progressivo (poderia coletar dados durante registro)

**Recomendações**:
```typescript
// login/page.tsx linha 14
fallbackRedirectUrl="/"
// Deveria ser:
fallbackRedirectUrl="/plano" // Ou detectar se já completou onboarding
```

---

## 📝 FASE 3: Onboarding (4 Etapas)

### Dashboard Inicial (`/` após login)

**Arquivo**: `apps/web/src/app/(dashboard)/page.tsx`

#### Componente

- ✅ Saudação personalizada: "Bem-vindo, {firstName}!"
- ✅ 2 Cards de ação:
  1. **Complete seu perfil** (azul) → `/onboarding`
  2. **Meu Plano de Treino** (verde) → `/plano`

**Propósito**: Direcionar usuário para onboarding ou plano.

### Onboarding (`/onboarding`)

**Arquivo**: `apps/web/src/app/(dashboard)/onboarding/page.tsx`

#### Estrutura

- ✅ Multi-step form (4 passos)
- ✅ Progress bar visual
- ✅ Validação com Zod
- ✅ React Hook Form
- ✅ Navegação Back/Next
- ✅ Submit apenas no passo 4

#### PASSO 1: Objetivo 🎯

**Componente**: `GoalSelector`
**Campos**:
- `goal` (required)

**Opções**:
- Emagrecer
- Ganhar massa muscular
- Manter forma

**Validação**: Obrigatório
**Navegação**: Bloqueada até selecionar objetivo

#### PASSO 2: Frequência e Contexto 📅

**Campos**:
- `frequencyPerWeek` (2-6 treinos/semana) - Slider/Selector
- `location` (Casa 🏠 / Academia 🏋️)
- `experienceLevel` (Iniciante / Intermediário / Avançado)

**Detalhes de Experiência**:
- **Iniciante**: <6 meses
- **Intermediário**: 6-24 meses
- **Avançado**: >2 anos

**Validação**: Todos os campos obrigatórios
**UX**: Cards clicáveis com hover states

#### PASSO 3: Equipamentos 🏋️

**Componente**: `EquipmentSelector`
**Campo**: `equipment` (array, multi-select)

**Opções** (baseado em EXERCISES constants):
- Peso corporal (bodyweight)
- Halteres (dumbbells)
- Barras (barbells)
- Máquinas (gym equipment)
- Kettlebells
- Faixas elásticas (resistance bands)

**Validação**: Pelo menos 1 equipamento selecionado

#### PASSO 4: Limitações 🩹

**Componente**: `LimitationsSelector`
**Campo**: `limitations` (array, opcional)

**Opções Comuns**:
- Dor lombar
- Lesão no joelho
- Lesão no ombro
- Limitação de mobilidade
- Outras

**Validação**: Opcional (pode pular)
**Propósito**: Filtrar exercícios contraindicados

#### Submissão

**Endpoint**: `POST /api/onboarding`
**Payload**:
```json
{
  "goal": "gain_muscle",
  "frequencyPerWeek": 4,
  "location": "gym",
  "experienceLevel": "intermediate",
  "equipment": ["bodyweight", "dumbbells", "barbells"],
  "limitations": ["lower_back_pain"]
}
```

**Fluxo Backend**:
1. Validação do payload
2. Criação/atualização do perfil do usuário
3. Geração do plano de treino (Semana 1)
4. Criação dos workouts específicos
5. Retorno de sucesso

**Redirecionamento pós-submit**: `/` (dashboard)
- Linha 63: `router.push('/')`
- ⚠️ **PROBLEMA**: Deveria redirecionar para `/plano` para mostrar imediatamente o plano gerado

### 🎨 Análise de UX - Onboarding

**Pontos Fortes**:
- ✅ Progress bar clara (visual + "Passo X de 4")
- ✅ Validação em tempo real
- ✅ Navegação intuitiva
- ✅ Último passo opcional (limitations)
- ✅ Feedback visual em cada seleção
- ✅ Mobile-first design
- ✅ Descriptions claras em cada passo

**Pontos de Melhoria**:
- ⚠️ Passo 2 muito denso (3 campos juntos)
- ⚠️ Sem preview do plano antes de submeter
- ⚠️ Linha 63: Redirect para `/` ao invés de `/plano`
- ⚠️ Sem salvamento parcial (se fechar, perde tudo)
- ⚠️ Sem estimativa de tempo ("Leva 3 minutos")
- ⚠️ Botão "Finalizar" genérico (poderia ser "Gerar meu plano")

**Pontos de Fricção**:
1. **Tempo percebido**: 4 passos parecem muitos
2. **Commitment inicial alto**: Sem preview do resultado
3. **Perda de progresso**: Se abandonar, tem que recomeçar

**Recomendações**:

1. **Adicionar estimativa de tempo**:
```tsx
<p className="text-sm text-muted-foreground text-center">
  Passo {currentStep} de {steps.length} • Tempo estimado: 3 minutos
</p>
```

2. **Melhorar redirect pós-onboarding**:
```typescript
// Linha 63
router.push('/plano'); // Ao invés de '/'
```

3. **Melhorar CTA final**:
```tsx
<Button type="submit" disabled={isSubmitting || !canProceed()}>
  {isSubmitting ? 'Gerando seu plano...' : 'Gerar meu plano personalizado 🎯'}
</Button>
```

4. **Separar passo 2 em dois**:
   - Passo 2a: Frequência
   - Passo 2b: Local + Experiência

---

## 📋 FASE 4: Visualização do Plano

### Plano de Treino (`/plano`)

**Arquivo**: `apps/web/src/app/(dashboard)/plano/page.tsx`

#### Hook Principal

`useWorkoutPlan()` - Busca dados da API

**Retorno**:
```typescript
{
  plan: {
    weekNumber: 1,
    status: 'active',
    difficultyMultiplier: 1.00
  },
  workouts: [
    {
      id: 123,
      dayOfWeek: 1, // Segunda
      workoutType: 'upper_body',
      status: 'pending',
      exercises: [...],
      completedAt: null
    },
    // ... mais workouts
  ],
  stats: {
    total: 4,
    completed: 0,
    completionRate: 0
  }
}
```

#### Layout da Página

**Header**:
- ✅ "Meu Plano de Treino"
- ✅ "Semana {weekNumber}"

**Stats Card** (Progresso):
- ✅ Total de treinos
- ✅ Concluídos
- ✅ Taxa de conclusão (%)
- ✅ Progress bar visual

**Lista de Workouts**:
Para cada workout:
- ✅ Dia da semana (ex: "Segunda-feira")
- ✅ Tipo de treino traduzido (ex: "Peito, Ombros, Tríceps")
- ✅ Badge de status:
  - 🟡 Pendente
  - 🟢 Concluído
  - ⚪ Pulado
- ✅ Número de exercícios
- ✅ Data de conclusão (se completado)
- ✅ CTA: "Iniciar treino" ou "Ver treino"

#### Estados

**Loading**:
- ✅ Skeleton screens (3 placeholders animados)

**Erro**:
- ✅ Card com mensagem de erro
- ✅ CTA: "Completar onboarding"

**Vazio**:
- ✅ "Nenhum treino encontrado"
- ✅ Link para onboarding

### 🎨 Análise de UX - Plano

**Pontos Fortes**:
- ✅ Visão clara do progresso semanal
- ✅ Stats motivacionais (taxa de conclusão)
- ✅ Dias da semana em português
- ✅ Status visual com cores
- ✅ Loading states bem implementados
- ✅ Hover effects nos cards
- ✅ Informação hierarquizada bem

**Pontos de Melhoria**:
- ⚠️ Sem indicação de "hoje" ou "próximo treino"
- ⚠️ Não mostra preview dos exercícios
- ⚠️ Sem filtros (mostrar apenas pendentes, etc)
- ⚠️ Falta dicas de quando treinar ("Treino A: Segundas e Quintas")
- ⚠️ Sem celebração quando completa semana
- ⚠️ Sem visualização de semanas anteriores

**Recomendações**:

1. **Destacar treino de hoje**:
```tsx
const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
const todayWorkout = workouts.find(w => w.dayOfWeek === today);

{todayWorkout && (
  <Card className="border-2 border-blue-500 bg-blue-50">
    <Badge>Treino de hoje 🎯</Badge>
    {/* Render todayWorkout */}
  </Card>
)}
```

2. **Adicionar preview de exercícios**:
```tsx
<p className="text-sm text-gray-500">
  {workout.exercises.slice(0, 3).map(e => e.exerciseName).join(', ')}
  {workout.exercises.length > 3 && ` +${workout.exercises.length - 3}`}
</p>
```

3. **Celebrar 100% de conclusão**:
```tsx
{stats.completionRate === 100 && (
  <ConfettiExplosion />
  <Card className="bg-gradient-to-r from-green-400 to-blue-500">
    <h2>Parabéns! Semana completa! 🎉</h2>
  </Card>
)}
```

---

## 💪 FASE 5: Execução de Treino

### Treino Individual (`/treino/[id]`)

**Arquivo**: `apps/web/src/app/(dashboard)/treino/[id]/page.tsx`

#### Header

- ✅ Link "← Voltar ao plano"
- ✅ Dia da semana (ex: "Segunda-feira")
- ✅ Número de exercícios
- ✅ Semana atual
- ✅ Badge "Treino concluído" (se completado)

#### Layout (Grid 2 colunas no desktop)

**Coluna Principal** (2/3):
1. **Card Instrucional**
   - Explica como usar (marcar séries, usar cronômetro)

2. **Lista de ExerciseCard** (um por exercício)

3. **Card de Conclusão** (se não concluído)
   - Border verde
   - Título: "Terminou o treino?"
   - Explicação sobre feedback
   - Botão: "Concluir Treino ✓"
   - Confirmação via `window.confirm()`

**Sidebar** (1/3, sticky):
1. **WorkoutTimer**
   - Cronômetro regressivo
   - Presets: 30s, 1min, 1:30, 2min
   - Som ao finalizar
   - Progress bar

2. **Resumo do Treino**
   - Total de exercícios
   - Total de séries
   - Tempo estimado (cálculo: séries × (rest + 45s) × 1.2)

#### ExerciseCard Component

**Arquivo**: `apps/web/src/components/workout/ExerciseCard.tsx`

**Estrutura**:

**Header**:
- ✅ Número do exercício + nome
- ✅ Tags de grupos musculares (chips azuis)
- ✅ Contador de séries completadas (X/Y)
- ✅ Badge "✓ Completo" quando 100%

**Conteúdo**:

1. **Vídeo Placeholder**
   - ⚠️ Placeholder estático (Linha 63-87)
   - Mensagem: "Vídeo disponível na próxima versão"
   - Ícone de play

2. **Detalhes do Exercício** (Grid 2x2):
   - Séries
   - Repetições (range: "8-12" ou valor fixo)
   - Descanso (formatado: "1min 30s" ou "60s")
   - Dificuldade (capitalizado)

3. **Notas/Dicas** (se existir):
   - Card azul
   - "Dica: {notesPt}"

4. **Tracking de Séries**:
   - Grid 4 colunas
   - Botões toggle para cada série
   - Estado:
     - Não marcado: Branco + número
     - Marcado: Verde + ✓
   - Estado local (não persiste no backend)

#### WorkoutTimer Component

**Arquivo**: `apps/web/src/components/workout/WorkoutTimer.tsx`

**Features**:
- ✅ Display grande: MM:SS
- ✅ Estados visuais:
  - Parado: Cinza
  - Rodando: Azul
  - Completo: Verde
- ✅ Progress bar animada
- ✅ Controles: Iniciar/Pausar/Resetar
- ✅ Quick sets: 30s, 1min, 1:30, 2min
- ✅ Som ao finalizar (base64 encoded wav)
- ✅ Mensagem: "✓ Descanso completo! Próxima série"

#### Fluxo de Conclusão

1. Usuário clica "Concluir Treino ✓"
2. `window.confirm()` pede confirmação
3. Se confirmar:
   - `POST /api/training/complete` com `workoutId`
   - Atualiza status do workout para "completed"
   - Redirect → `/treino/${workoutId}/feedback`
4. Se cancelar: nada acontece

### 🎨 Análise de UX - Execução

**Pontos Fortes**:
- ✅ Cronômetro sticky (sempre visível)
- ✅ Tracking visual de séries
- ✅ Quick presets de tempo
- ✅ Feedback sonoro ao finalizar descanso
- ✅ Layout responsivo (sidebar vira stack no mobile)
- ✅ Cards de exercício bem informados
- ✅ Tempo estimado ajuda no planejamento
- ✅ Progress visual (border verde quando completo)
- ✅ Confirmação antes de concluir

**Pontos de Fricção**:
1. **Vídeos ausentes**: Linha 63-87 - Placeholder estático
2. **Séries não persistem**: Fechar página perde progresso
3. **Sem modo offline completo**: Precisa internet
4. **`window.confirm()` é old-school**: Deveria ser modal bonito
5. **Sem vibração no mobile**: Timer completo poderia vibrar
6. **Sem log de peso/carga**: Usuário não anota quanto usou

**Pontos de Melhoria**:
- ⚠️ Sem indicação de exercício atual (qual fazer agora?)
- ⚠️ Não marca automaticamente série após cronômetro
- ⚠️ Sem tutorial de primeira vez
- ⚠️ Falta botão de emergência ("Pular exercício")
- ⚠️ Sem opção de substituir exercício
- ⚠️ Não guarda histórico de cargas

**Recomendações CRÍTICAS**:

1. **Integrar vídeos** (Prioridade ALTA):
```tsx
// ExerciseCard.tsx linha 63
{exercise.videoUrl ? (
  <video
    src={exercise.videoUrl}
    controls
    poster={exercise.thumbnailUrl}
    className="aspect-video rounded-lg"
  />
) : (
  // Placeholder atual
)}
```

2. **Persistir progresso de séries** (localStorage):
```tsx
const [completedSets, setCompletedSets] = useState<boolean[]>(() => {
  const saved = localStorage.getItem(`workout-${workout.id}-ex-${exercise.id}`);
  return saved ? JSON.parse(saved) : new Array(exercise.sets).fill(false);
});

useEffect(() => {
  localStorage.setItem(
    `workout-${workout.id}-ex-${exercise.id}`,
    JSON.stringify(completedSets)
  );
}, [completedSets]);
```

3. **Substituir `window.confirm()` por modal**:
```tsx
import { AlertDialog } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger>Concluir Treino ✓</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Concluir treino?</AlertDialogTitle>
    <AlertDialogDescription>
      Ao concluir, você poderá dar feedback sobre a dificuldade.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleCompleteWorkout}>
        Sim, concluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

4. **Adicionar campo de peso/carga**:
```tsx
<div className="mt-4">
  <label className="text-sm">Peso usado (opcional):</label>
  <input
    type="number"
    placeholder="Ex: 20kg"
    className="..."
  />
</div>
```

5. **Vibração ao completar série** (mobile):
```tsx
const toggleSet = (index: number) => {
  const updated = [...completedSets];
  updated[index] = !updated[index];

  if (updated[index] && 'vibrate' in navigator) {
    navigator.vibrate(50); // Haptic feedback
  }

  setCompletedSets(updated);
};
```

---

## 💬 FASE 6: Feedback Pós-Treino

### Feedback (`/treino/[id]/feedback`)

**Arquivo**: `apps/web/src/app/(dashboard)/treino/[id]/feedback/page.tsx`

#### Header

- ✅ Link "← Voltar ao treino"
- ✅ Título: "Como foi o treino?"
- ✅ Subtítulo: "Seu feedback nos ajuda a ajustar seu plano para a próxima semana"

#### Formulário

**Campo 1: Dificuldade* (obrigatório)**

3 opções em cards grandes:

1. **Fácil** 😊 (Verde)
   - "Poderia ter feito mais séries ou usado mais peso"

2. **Ok** 💪 (Azul)
   - "Desafiador mas consegui completar bem"

3. **Difícil** 😰 (Vermelho)
   - "Muito desafiador, tive dificuldade para completar"

**UX**:
- Cards clicáveis
- Hover states
- Seleção exclusiva (radio button)
- Checkmark quando selecionado
- Cores mudam (bg + border + texto branco)

**Campo 2: Duração (opcional)**

- Input numérico
- Placeholder: "Ex: 45"
- Label: "minutos"
- Range: 1-300 min

**Campo 3: Observações (opcional)**

- Textarea
- Placeholder: "Ex: Senti dificuldade no agachamento..."
- Max: 500 caracteres
- Contador: "X/500 caracteres"
- Rows: 4

#### Info Box (Como usamos seu feedback?)

- ✅ Card azul informativo
- ✅ Explica o algoritmo:
  - **Fácil**: +10% volume
  - **Ok**: Progressão natural
  - **Difícil**: -10% volume
- ✅ Nota: "Ajustes toda segunda-feira"

#### Actions

- ✅ Botão primário: "Enviar Feedback" (disabled se não selecionou dificuldade)
- ✅ Botão secundário: "Pular" → volta para `/plano`

#### Submissão

**Endpoint**: `POST /api/feedback`

**Payload**:
```json
{
  "workoutId": 123,
  "difficultyRating": "ok",
  "durationMinutes": 45,
  "notes": "Agachamento pesado, resto tranquilo"
}
```

**Validação**:
- `difficultyRating`: required, enum ['easy', 'ok', 'hard']
- `durationMinutes`: optional, number 1-300
- `notes`: optional, string max 500

**Sucesso**:
- Redirect → `/plano`

**Erro**:
- Display error message em card vermelho

### 🎨 Análise de UX - Feedback

**Pontos Fortes**:
- ✅ Interface intuitiva (emoji + cores)
- ✅ Explica como será usado (transparência)
- ✅ Campos opcionais (baixa fricção)
- ✅ Opção de pular (não força)
- ✅ Visual claro de seleção
- ✅ Validação em tempo real
- ✅ Feedback do algoritmo explicado

**Pontos de Melhoria**:
- ⚠️ Sem incentivo para dar feedback completo
- ⚠️ Não mostra histórico de feedbacks anteriores
- ⚠️ Falta campos granulares (dificuldade por exercício)
- ⚠️ Sem pergunta sobre energia/ânimo
- ⚠️ Não captura dor/desconforto específico

**Recomendações**:

1. **Adicionar gamificação**:
```tsx
{notes && notes.length > 50 && (
  <Badge variant="success">
    +10 XP por feedback detalhado! 🏆
  </Badge>
)}
```

2. **Mostrar impacto imediato**:
```tsx
{selectedRating === 'easy' && (
  <Alert variant="info">
    ℹ️ Na próxima semana, vamos aumentar em 10% as séries ou peso para te desafiar mais!
  </Alert>
)}
```

3. **Perguntas adicionais (opcional)**:
```tsx
<Select label="Nível de energia durante o treino">
  <option>Muito cansado</option>
  <option>Normal</option>
  <option>Energizado</option>
</Select>

<Select label="Sentiu alguma dor?">
  <option>Não</option>
  <option>Leve desconforto</option>
  <option>Dor significativa</option>
</Select>
```

---

## 👤 FASE 7: Perfil e Configurações

### Perfil (`/perfil`)

**Arquivo**: `apps/web/src/app/(dashboard)/perfil/page.tsx`

#### Layout (Grid 3 colunas)

**Coluna 1-2: Informações Pessoais**

- ✅ Avatar do Clerk
- ✅ Nome completo
- ✅ Email
- ✅ Grid 2x2 com:
  - Nome
  - Sobrenome
  - Email
  - Membro desde (data formatada PT-BR)
- ✅ Link para editar conta (Clerk dashboard)

**Coluna 3: Estatísticas Rápidas**

- ⚠️ **HARDCODED** (não busca dados reais):
  - Semana atual: 1
  - Treinos concluídos: 0
  - Taxa de conclusão: 0%

**Coluna 1-2: Preferências de Treino**

- ⚠️ **HARDCODED** ("Não configurado"):
  - Objetivo: -
  - Frequência: -
  - Local: -
  - Nível: -
- ✅ Botão "Reconfigurar" → `/onboarding`
- ✅ Info box azul incentivando onboarding

**Coluna 3: Ações**

- ✅ Ver Plano de Treino
- ✅ Reconfigurar Preferências
- ⚠️ Sair da Conta (não funcional, `onClick={() => {}}`)

**Footer: Sobre o App**

- ✅ Versão: 1.0.0 (MVP)
- ✅ Última atualização: Janeiro 2026
- ✅ Exercícios disponíveis: 30+

### 🎨 Análise de UX - Perfil

**Pontos Fortes**:
- ✅ Informações do Clerk bem integradas
- ✅ Layout organizado
- ✅ Quick actions acessíveis

**Problemas CRÍTICOS**:
1. **Stats hardcoded** (Linha 91-101)
   - Não reflete progresso real
   - Desmotivador (sempre 0%)

2. **Preferências hardcoded** (Linha 120-136)
   - Diz "Não configurado" mesmo após onboarding
   - Não busca perfil do usuário

3. **Botão "Sair" não funciona** (Linha 158)
   - `onClick={() => {}}` é placeholder
   - Deveria usar `<SignOutButton />` do Clerk

**Recomendações CRÍTICAS**:

1. **Buscar stats reais**:
```tsx
const { data: stats } = useQuery({
  queryKey: ['user-stats'],
  queryFn: async () => {
    const res = await fetch('/api/users/me/stats');
    return res.json();
  }
});

// Renderizar:
<p className="text-2xl font-bold">{stats?.weekNumber || 1}</p>
<p className="text-2xl font-bold">{stats?.completedWorkouts || 0}</p>
<p className="text-2xl font-bold">{stats?.completionRate || 0}%</p>
```

2. **Buscar preferências reais**:
```tsx
const { data: profile } = useQuery({
  queryKey: ['user-profile'],
  queryFn: async () => {
    const res = await fetch('/api/users/me/profile');
    return res.json();
  }
});

// Renderizar:
<span>{GOAL_LABELS[profile?.goal] || 'Não configurado'}</span>
<span>{profile?.frequencyPerWeek ? `${profile.frequencyPerWeek}x/semana` : '-'}</span>
```

3. **Implementar logout**:
```tsx
import { SignOutButton } from '@clerk/nextjs';

<SignOutButton>
  <Button variant="outline" className="w-full justify-start text-red-600">
    Sair da Conta
  </Button>
</SignOutButton>
```

---

## 🔄 FASE 8: Ajuste Semanal Automático

### Cron Trigger (Backend)

**Arquivo**: `apps/api/src/cron/weekly-adjustment.ts`

**Trigger**: Toda segunda-feira às 6am UTC (Linha 15 `wrangler.toml`)

#### Algoritmo

1. **Buscar usuários ativos**
   - Com planos na semana anterior

2. **Coletar feedback da semana**
   - Contar feedbacks por dificuldade

3. **Calcular ajuste**:
   - Se 60%+ = "easy" → +10% volume
   - Se 60%+ = "hard" → -10% volume
   - Senão → manter progressão natural

4. **Gerar nova semana**
   - WeekNumber + 1
   - Aplicar difficultyMultiplier
   - A cada 4 semanas: trocar 2 exercícios

5. **Notificar usuário** (futuro)
   - Email/push: "Sua semana X está pronta!"

### Endpoint Manual (Admin)

**Arquivo**: `apps/api/src/index.ts:42`

`POST /api/admin/adjust-week`

**Payload**:
```json
{
  "userId": "user_xxx",
  "weekNumber": 2
}
```

**Propósito**: Testar ajuste manual (sem esperar cron)

⚠️ **PROBLEMA**: Sem autenticação (ver PRODUCTION_READINESS.md)

### 🎨 Análise - Ajuste Semanal

**Pontos Fortes**:
- ✅ Automatizado (zero esforço do usuário)
- ✅ Baseado em dados reais (feedback)
- ✅ Algoritmo simples e compreensível
- ✅ Progressive overload implementado
- ✅ Variedade (troca exercícios a cada 4 semanas)

**Pontos de Melhoria**:
- ⚠️ Sem notificação ao usuário (silent update)
- ⚠️ Não considera contexto (feriados, viagens)
- ⚠️ Ajuste binário (apenas ±10%)
- ⚠️ Mínimo de 3 feedbacks pode ser restritivo
- ⚠️ Não personaliza por exercício individual

**Recomendações**:

1. **Adicionar notificação**:
```typescript
// Após gerar nova semana
await sendEmail({
  to: user.email,
  subject: 'Seu plano da Semana ' + newWeekNumber + ' está pronto!',
  body: `
    Olá ${user.name}!

    Baseado no seu feedback, ${adjustment}

    Acesse agora: ${APP_URL}/plano
  `
});
```

2. **Permitir pausar plano**:
```tsx
// Em /perfil
<Button onClick={pausePlan}>
  Pausar plano (férias/viagem)
</Button>
```

3. **Ajuste mais granular**:
```typescript
// Ao invés de apenas ±10%
if (easyRate > 0.8) adjustment = 1.15; // +15%
else if (easyRate > 0.6) adjustment = 1.10; // +10%
else if (hardRate > 0.8) adjustment = 0.85; // -15%
else if (hardRate > 0.6) adjustment = 0.90; // -10%
else adjustment = 1.05; // +5% progressão natural
```

---

## 📊 MAPA VISUAL DA JORNADA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                          AQUISIÇÃO                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Landing Page (/)
                    ┌─────────────────┐
                    │ Proposta valor  │
                    │ Features (6)    │
                    │ Como funciona   │
                    │ CTAs duplos     │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
         Já tem conta                 Criar conta
         /login                       /register
                │                           │
                └─────────────┬─────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ATIVAÇÃO                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  Dashboard Inicial (/)
                  ┌──────────────────────┐
                  │ Bem-vindo, {nome}!   │
                  │ ┌──────────────────┐ │
                  │ │ Completar perfil │ │ → /onboarding
                  │ └──────────────────┘ │
                  └──────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ONBOARDING (4 PASSOS)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
      ┌───────────────────────┼───────────────────────┐
      ▼                       ▼                       ▼
 Passo 1: Objetivo    Passo 2: Frequência    Passo 3: Equipamento
 ┌─────────────┐     ┌──────────────────┐    ┌──────────────────┐
 │ Emagrecer   │     │ 2-6x/semana      │    │ Bodyweight       │
 │ Ganhar massa│     │ Casa/Academia    │    │ Dumbbells        │
 │ Manter forma│     │ Iniciante-Avançado│   │ Barbells         │
 └─────────────┘     └──────────────────┘    └──────────────────┘
                              │
                              ▼
                      Passo 4: Limitações
                      ┌─────────────────┐
                      │ Lesões (opcional)│
                      └─────────────────┘
                              │
                              ▼
                      POST /api/onboarding
                      ┌──────────────────────┐
                      │ Criar perfil         │
                      │ Gerar Semana 1       │
                      │ Criar workouts       │
                      └──────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ENGAJAMENTO                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      Plano Gerado (/plano)
                      ┌──────────────────────┐
                      │ Semana 1             │
                      │ ┌──────────────────┐ │
                      │ │ Segunda: Upper   │ │
                      │ │ Terça: Lower     │ │
                      │ │ Quinta: Upper    │ │
                      │ │ Sexta: Lower     │ │
                      │ └──────────────────┘ │
                      │ Stats: 0/4 (0%)      │
                      └──────────────────────┘
                              │
                              ▼
                  Seleciona treino (ex: Segunda)
                              │
                              ▼
                  Página do Treino (/treino/123)
                  ┌──────────────────────────────┐
                  │ ┌──────────────────────────┐ │
                  │ │ ExerciseCard 1           │ │
                  │ │ - Vídeo (placeholder)    │ │
                  │ │ - 3x8-12                 │ │
                  │ │ - Rest: 60s              │ │
                  │ │ - [✓][✓][ ] Séries       │ │
                  │ └──────────────────────────┘ │
                  │ ...mais exercícios           │
                  │                              │
                  │ Sidebar:                     │
                  │ ┌──────────────────────────┐ │
                  │ │ WorkoutTimer             │ │
                  │ │ 01:00                    │ │
                  │ │ [30s][1min][1:30][2min] │ │
                  │ └──────────────────────────┘ │
                  │                              │
                  │ [Concluir Treino ✓]          │
                  └──────────────────────────────┘
                              │
                              ▼
                  Confirma conclusão
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FEEDBACK                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  Feedback (/treino/123/feedback)
                  ┌──────────────────────────────┐
                  │ Como foi o treino?           │
                  │ ┌──────────────────────────┐ │
                  │ │ 😊 Fácil                 │ │
                  │ │ 💪 Ok      ← [Selecionado]│
                  │ │ 😰 Difícil               │ │
                  │ └──────────────────────────┘ │
                  │                              │
                  │ Duração: [45] minutos        │
                  │ Notas: "Ótimo treino!"       │
                  │                              │
                  │ [Enviar Feedback] [Pular]    │
                  └──────────────────────────────┘
                              │
                              ▼
                    POST /api/feedback
                    Salva no banco
                              │
                              ▼
                    Volta para /plano
                    Stats atualizadas: 1/4 (25%)
                              │
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          Repete ciclo            Completa semana
          para próximos           (4/4 = 100%)
          treinos                       │
                                        ▼
                                 Aguarda segunda-feira
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AJUSTE SEMANAL (AUTOMÁTICO)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  Cron Trigger (Segunda 6am UTC)
                  ┌──────────────────────────────┐
                  │ 1. Buscar usuários ativos    │
                  │ 2. Analisar feedbacks        │
                  │    - 60%+ easy → +10%        │
                  │    - 60%+ hard → -10%        │
                  │    - Senão → progressão      │
                  │ 3. Gerar Semana 2            │
                  │ 4. Se semana 4n: trocar 2    │
                  │    exercícios                │
                  └──────────────────────────────┘
                              │
                              ▼
                    Usuário vê Semana 2 em /plano
                    (sem notificação - vai descobrir quando acessar)
                              │
                              ▼
                        LOOP INFINITO
                  (Treino → Feedback → Ajuste)
```

---

## 🔴 PONTOS DE FRICÇÃO IDENTIFICADOS

### 1. **Vídeos Ausentes** (CRÍTICO)

**Localização**: ExerciseCard.tsx:63-87
**Impacto**: Usuário não sabe executar exercícios corretamente
**Risco**: Lesões, técnica incorreta, abandono
**Solução**: Integrar vídeos do R2 ou YouTube

### 2. **Redirect Inconsistente Pós-Onboarding**

**Localização**: onboarding/page.tsx:63
**Problema**: Redireciona para `/` ao invés de `/plano`
**Impacto**: Usuário não vê imediatamente o plano gerado
**Frustração**: "Onde está meu plano?"

### 3. **Dados Hardcoded no Perfil**

**Localização**: perfil/page.tsx:91-136
**Problema**: Stats e preferências não refletem realidade
**Impacto**: Perda de confiança no app
**Desmotivação**: Stats sempre em 0%

### 4. **Progresso de Séries Não Persiste**

**Localização**: ExerciseCard.tsx
**Problema**: Estado local, fechar página perde progresso
**Impacto**: Usuário tem que lembrar quais séries fez
**Frustração**: "Perdi meu progresso"

### 5. **Sem Notificação de Nova Semana**

**Localização**: weekly-adjustment.ts
**Problema**: Update silencioso toda segunda
**Impacto**: Usuário não sabe que tem plano novo
**Oportunidade perdida**: Re-engajamento

### 6. **Onboarding Longo**

**Problema**: 4 passos parecem muitos
**Impacto**: Abandono no meio
**Taxa de conversão**: Pode cair 50% entre passo 1 e 4

### 7. **Sem Modo Offline Real**

**Problema**: PWA configurado mas precisa internet para dados
**Impacto**: Academia com Wi-Fi ruim = app quebra
**Expectativa**: "Instalei, deveria funcionar offline"

### 8. **Sem Gamificação**

**Problema**: Nenhum sistema de recompensas
**Impacto**: Baixa motivação de longo prazo
**Oportunidade**: Streaks, badges, níveis

---

## ✨ OPORTUNIDADES DE MELHORIA

### Quick Wins (< 4 horas)

1. **Corrigir redirects**:
   - onboarding → `/plano`
   - login → `/plano`

2. **Destacar treino de hoje** no /plano

3. **Melhorar CTAs**:
   - "Finalizar" → "Gerar meu plano personalizado 🎯"

4. **Adicionar estimativa de tempo** no onboarding

5. **Implementar logout** real no perfil

### Medium Wins (1-2 dias)

6. **Buscar dados reais** no perfil (stats + preferências)

7. **Persistir progresso de séries** (localStorage)

8. **Substituir `window.confirm()`** por modals bonitos

9. **Adicionar vibração** no mobile (haptic feedback)

10. **Preview de exercícios** no card do plano

### Big Wins (3-7 dias)

11. **Integrar vídeos** de exercícios (R2 + Cloudflare Stream)

12. **Notificações push** de nova semana

13. **Modo offline completo** (cache workout data)

14. **Sistema de gamificação**:
    - Streaks (dias consecutivos)
    - Badges (1ª semana, 10 treinos, etc)
    - Níveis (Bronze → Prata → Ouro)

15. **Histórico de progresso**:
    - Gráficos de volume semanal
    - Cargas registradas
    - Feedbacks anteriores

---

## 📈 MÉTRICAS RECOMENDADAS

### Aquisição

- **Landing → Register**: Taxa de conversão
- **Register → Onboarding Start**: Taxa de ativação
- **Fonte de tráfego**: Orgânico vs Paid vs Referral

### Ativação (Onboarding)

- **Passo 1 → Passo 2**: 80%+ (esperado)
- **Passo 2 → Passo 3**: 70%+
- **Passo 3 → Passo 4**: 90%+ (último passo é opcional)
- **Completion Rate**: 50-60% (meta)
- **Tempo médio**: < 5 minutos

### Engajamento (Core Loop)

- **D1 Return**: 40%+ (voltam no dia seguinte)
- **D7 Return**: 30%+ (voltam na semana 1)
- **D30 Return**: 20%+ (mantêm após 1 mês)
- **Workouts/Week**: 2.5+ (média)
- **Feedback Rate**: 60%+ (dão feedback após treino)
- **Completion Rate**: 70%+ (completam treinos iniciados)

### Retenção (Long-term)

- **Week 2 Retention**: 50%+ (chegam na semana 2)
- **Week 4 Retention**: 30%+ (chegam na semana 4)
- **Week 12 Retention**: 15%+ (3 meses)
- **Churn Triggers**: Identificar padrões de abandono

### Satisfação

- **NPS**: 40+ (Net Promoter Score)
- **Feedback Quality**: % de feedbacks com notas
- **Time in App**: 15-30 min/workout

---

## 🎯 PERSONAS E CENÁRIOS DE USO

### Persona 1: João - Iniciante Motivado

**Perfil**:
- 28 anos, brasileiro em Portugal
- Nunca treinou antes
- Quer emagrecer 10kg
- Treina em casa, sem equipamentos

**Jornada**:
1. ✅ Descobre via Google "treino em casa português"
2. ✅ Landing page ressoa ("brasileiro no exterior")
3. ✅ Registra rápido (Clerk email)
4. ⚠️ Onboarding: 4 passos parecem muitos, mas completa
5. ✅ Vê plano gerado: 3x/semana, full body
6. ❌ Inicia primeiro treino: **TRAVA nos vídeos ausentes**
   - "Como faço flexão corretamente?"
7. ⚠️ Completa treino mas com técnica duvidosa
8. ✅ Dá feedback "Ok"
9. ✅ Volta na quarta, completa 2º treino
10. ❌ Sexta tem imprevisto, não treina
11. ⚠️ Segunda: não sabia que tinha Semana 2 nova
12. ❌ Abandona (falta de motivação + sem notificação)

**Taxa de sucesso**: 40% (completa semana 1, abandona na 2)

**O que salvaria**:
- Vídeos de exercícios
- Notificação push segunda
- Gamificação (streak de 2 dias)

### Persona 2: Maria - Intermediária Consistente

**Perfil**:
- 35 anos, brasileira na Alemanha
- Treina há 1 ano (academia)
- Quer ganhar massa muscular
- Academia completa

**Jornada**:
1. ✅ Indicação de amiga
2. ✅ Registra e completa onboarding rápido
3. ✅ Vê plano: 4x/semana Push/Pull/Legs
4. ✅ Reconhece exercícios (tem experiência)
5. ✅ Usa cronômetro constantemente
6. ⚠️ Frustra com séries não salvando
7. ✅ Completa semana 1 (4/4 treinos)
8. ✅ Dá feedbacks detalhados
9. ✅ Semana 2: vê plano ajustado (+10% volume)
10. ✅ Continua por 4 semanas
11. ❌ Semana 5: exercícios trocados, mas **sem vídeos**
    - "Nunca fiz Romanian Deadlift"
12. ⚠️ Busca vídeo no YouTube
13. ✅ Continua usando o app

**Taxa de sucesso**: 80% (power user)

**O que melhoraria**:
- Vídeos
- Histórico de cargas
- Gráficos de progresso

### Persona 3: Carlos - Avançado Exigente

**Perfil**:
- 42 anos, brasileiro nos EUA
- Treina há 5+ anos
- Manter forma
- Tem home gym completo

**Jornada**:
1. ✅ Testa o app por curiosidade
2. ✅ Onboarding: seleciona "Avançado"
3. ⚠️ Plano gerado parece genérico
4. ❌ Quer customizar exercícios → **não permite**
5. ❌ Quer ajustar séries/reps → **não permite**
6. ❌ Feedback "easy" mas +10% não é suficiente
7. ❌ Abandona: "Muito básico, preciso de Periodização"

**Taxa de sucesso**: 10% (churns rápido)

**O que precisaria**:
- Periodização (linear, ondulada)
- Customização de exercícios
- Fases (força, hipertrofia, deload)
- Tracking de 1RM

**Conclusão**: App é para iniciantes-intermediários, não avançados.

---

## 🏁 RESUMO EXECUTIVO

### 🟢 O que está funcionando bem

1. **Proposta de valor clara** (PT-BR focus)
2. **Onboarding estruturado** (validado, step-by-step)
3. **Core loop sólido** (Treino → Feedback → Ajuste)
4. **UX consistente** (shadcn/ui, design system)
5. **Autenticação robusta** (Clerk)
6. **Progressive overload** implementado

### 🔴 Problemas Críticos que Bloqueiam Adoção

1. **Vídeos ausentes** → Usuários não sabem executar
2. **Dados hardcoded no perfil** → Perda de confiança
3. **Progresso não persiste** → Frustração
4. **Sem notificações** → Baixo re-engajamento
5. **Redirects confusos** → Abandono

### 🟡 Melhorias de Alta Prioridade

1. **Buscar dados reais** (stats, preferências)
2. **Persistir progresso** (localStorage)
3. **Notificar nova semana** (push/email)
4. **Gamificação básica** (streaks, badges)
5. **Modo offline real** (service worker + cache)

### 📊 Taxa de Sucesso Estimada (Estado Atual)

- **Completa onboarding**: 50-60%
- **Completa Week 1**: 30-40%
- **Chega na Week 4**: 15-20%
- **Retenção D30**: 10-15%

### 📊 Taxa de Sucesso Estimada (Após Correções Críticas)

- **Completa onboarding**: 60-70%
- **Completa Week 1**: 50-60%
- **Chega na Week 4**: 30-40%
- **Retenção D30**: 20-30%

### 🎯 Recomendação Final

**PRIORIZAR NESTA ORDEM**:

1. **Sprint 1 (Semana 1)**: Corrigir bugs críticos
   - Redirects
   - Dados reais no perfil
   - Persistência de progresso
   - Logout funcional

2. **Sprint 2 (Semana 2)**: Adicionar vídeos
   - Upload para R2
   - Integração no ExerciseCard
   - Thumbnails

3. **Sprint 3 (Semana 3)**: Notificações + Gamificação
   - Push notifications (nova semana)
   - Streaks
   - Badges básicos

4. **Sprint 4 (Semana 4)**: Modo offline + Histórico
   - Service worker aprimorado
   - Histórico de treinos
   - Gráficos de progresso

---

**Documentação criada**: 04/01/2026
**Última atualização**: 04/01/2026
**Versão**: 1.0.0
