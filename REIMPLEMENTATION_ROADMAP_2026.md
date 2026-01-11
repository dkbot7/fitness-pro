# 🚀 FitPro - Plano Completo de Reimplementação e Evolução 2026

**Data:** 11 de Janeiro de 2026
**Status Atual:** MVP Funcional (70% completo)
**Objetivo:** Completar 100% das features planejadas + novas features avançadas

---

## 📊 Executive Summary

### Status Atual
- ✅ **Completo (70%)**: Autenticação, Onboarding, Geração de Treinos, Gamificação UI, Perfil, PWA
- ⚠️ **Parcial (20%)**: Video System, Feedback Adjustment, Push Notifications
- ❌ **Pendente (10%)**: Social Features, Analytics Avançado, IA/ML Features

### Objetivos do Roadmap
1. **Completar features planejadas** que ficaram pendentes
2. **Reimplementar sistemas migrados** (Weekly Adjustment para D1)
3. **Adicionar features avançadas** para diferenciação competitiva
4. **Melhorar performance** e escalabilidade
5. **Preparar para escala** (1000+ usuários simultâneos)

---

## 🎯 FASE 1: COMPLETAR FEATURES EXISTENTES (Prioridade: ALTA)

### 1.1 Sistema de Vídeos (Cloudflare R2)

**Status Atual:** Frontend pronto, infraestrutura pendente
**Prioridade:** 🔴 ALTA
**Estimativa:** 3-4 dias
**Dependências:** Cloudflare R2 bucket, processamento de vídeo

#### Implementação:

**Backend:**
```typescript
// apps/api/src/handlers/videos.ts
export async function getExerciseVideo(c: Context) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS; // R2 binding

  // Stream video from R2
  const object = await bucket.get(`exercises/${slug}.mp4`);
  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=2592000', // 30 days
      'Accept-Ranges': 'bytes',
    }
  });
}

// Thumbnail endpoint
export async function getExerciseThumbnail(c: Context) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS;

  const object = await bucket.get(`thumbnails/${slug}.jpg`);
  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=2592000',
    }
  });
}
```

**Infraestrutura:**
```bash
# 1. Criar R2 bucket
wrangler r2 bucket create fitness-pro-videos

# 2. Configurar em wrangler.toml
[[r2_buckets]]
binding = "VIDEOS"
bucket_name = "fitness-pro-videos"

# 3. Upload inicial de vídeos
# Usar script de upload automatizado
```

**Script de Processamento de Vídeos:**
```typescript
// scripts/process-and-upload-videos.ts
import { R2 } from '@cloudflare/workers-types';
import ffmpeg from 'fluent-ffmpeg';

const VIDEO_SPECS = {
  resolution: '1280x720', // 720p
  bitrate: '2000k',
  codec: 'libx264',
  preset: 'medium',
  format: 'mp4',
};

async function processVideo(inputPath: string, slug: string) {
  const outputPath = `/tmp/${slug}.mp4`;
  const thumbnailPath = `/tmp/${slug}.jpg`;

  // Processar vídeo
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(VIDEO_SPECS.resolution)
      .videoBitrate(VIDEO_SPECS.bitrate)
      .videoCodec(VIDEO_SPECS.codec)
      .outputOptions([`-preset ${VIDEO_SPECS.preset}`])
      .format(VIDEO_SPECS.format)
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });

  // Gerar thumbnail (frame 3s)
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['3'],
        filename: `${slug}.jpg`,
        folder: '/tmp',
        size: '640x360'
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Upload para R2
  await uploadToR2(outputPath, `exercises/${slug}.mp4`);
  await uploadToR2(thumbnailPath, `thumbnails/${slug}.jpg`);

  // Atualizar database
  await updateExerciseVideoUrls(slug);
}
```

**Priorização de Vídeos (MVP):**
1. **Fase 1 (10 exercícios)** - Mais comuns para iniciantes:
   - `push-ups`, `bodyweight-squats`, `plank`, `lunges`, `crunches`
   - `jumping-jacks`, `glute-bridges`, `mountain-climbers`, `burpees`, `tricep-dips-chair`

2. **Fase 2 (20 exercícios)** - Academia/Intermediário:
   - Exercícios com halteres e barra
   - Exercícios de puxar/empurrar

3. **Fase 3 (37 exercícios restantes)** - Avançados:
   - Exercícios especializados
   - Variações avançadas

**Endpoints:**
- `GET /api/exercises/:slug/video` - Stream vídeo
- `GET /api/exercises/:slug/thumbnail` - Thumbnail
- `GET /api/exercises/:slug/signed-url` - URL assinada (24h) para download

**Métricas:**
- Tracking de views por vídeo
- Tempo médio assistido
- Taxa de conclusão

---

### 1.2 Sistema de Ajuste Semanal (Weekly Adjustment)

**Status Atual:** Serviço desabilitado (migração D1 pendente)
**Prioridade:** 🔴 ALTA
**Estimativa:** 2-3 dias
**Dependências:** Nenhuma

#### Implementação:

**Reimplementar Workout Adjuster para D1:**
```typescript
// apps/api/src/services/workout-adjuster.ts (REESCRITO PARA D1)
import { eq, and, gte, lte } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export interface AdjustmentResult {
  userId: string;
  weekNumber: number;
  adjustments: {
    difficultyIncrease: number;
    volumeChange: number;
    exercisesSwapped: number;
  };
}

/**
 * Analisa feedback da semana passada e ajusta próxima semana
 */
export async function adjustWeeklyWorkouts(
  db: DrizzleD1Database,
  userId: string
): Promise<AdjustmentResult> {

  // 1. Buscar semana atual do usuário
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) throw new Error('Profile not found');

  const currentWeek = profile.currentWeek || 1;
  const nextWeek = currentWeek + 1;

  // 2. Coletar feedback da semana passada
  const lastWeekFeedback = await db
    .select()
    .from(workoutFeedback)
    .innerJoin(workouts, eq(workoutFeedback.workoutId, workouts.id))
    .innerJoin(workoutPlans, eq(workouts.planId, workoutPlans.id))
    .where(
      and(
        eq(workoutPlans.userId, userId),
        eq(workoutPlans.weekNumber, currentWeek)
      )
    );

  // 3. Calcular métricas de ajuste
  const avgDifficulty = calculateAverageDifficulty(lastWeekFeedback);
  const completionRate = await calculateCompletionRate(db, userId, currentWeek);

  // 4. Determinar tipo de ajuste
  let difficultyMultiplier = 1.0;
  let volumeAdjustment = 0;

  if (avgDifficulty === 'easy' && completionRate >= 0.8) {
    // Usuário achou fácil e completou tudo → aumentar dificuldade
    difficultyMultiplier = 1.15;
    volumeAdjustment = 1; // +1 set
  } else if (avgDifficulty === 'hard' || completionRate < 0.5) {
    // Usuário achou difícil ou não completou → reduzir dificuldade
    difficultyMultiplier = 0.9;
    volumeAdjustment = -1; // -1 set (mín 2)
  }

  // 5. Aplicar ajustes à próxima semana
  const exercisesSwapped = await applyAdjustments(
    db,
    userId,
    nextWeek,
    difficultyMultiplier,
    volumeAdjustment
  );

  return {
    userId,
    weekNumber: nextWeek,
    adjustments: {
      difficultyIncrease: difficultyMultiplier,
      volumeChange: volumeAdjustment,
      exercisesSwapped,
    }
  };
}

/**
 * Calcula dificuldade média dos feedbacks
 */
function calculateAverageDifficulty(
  feedbacks: any[]
): 'easy' | 'ok' | 'hard' {
  if (feedbacks.length === 0) return 'ok';

  const scores = { easy: -1, ok: 0, hard: 1 };
  const avgScore = feedbacks.reduce(
    (sum, f) => sum + scores[f.workout_feedback.difficultyRating],
    0
  ) / feedbacks.length;

  if (avgScore < -0.3) return 'easy';
  if (avgScore > 0.3) return 'hard';
  return 'ok';
}

/**
 * Calcula taxa de conclusão da semana
 */
async function calculateCompletionRate(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<number> {
  const workouts = await db
    .select()
    .from(workouts)
    .innerJoin(workoutPlans, eq(workouts.planId, workoutPlans.id))
    .where(
      and(
        eq(workoutPlans.userId, userId),
        eq(workoutPlans.weekNumber, weekNumber)
      )
    );

  if (workouts.length === 0) return 0;

  const completed = workouts.filter(
    w => w.workouts.status === 'completed'
  ).length;

  return completed / workouts.length;
}

/**
 * Aplica ajustes aos workout exercises da próxima semana
 */
async function applyAdjustments(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number,
  difficultyMultiplier: number,
  volumeAdjustment: number
): Promise<number> {

  // Buscar próxima semana
  const [plan] = await db
    .select()
    .from(workoutPlans)
    .where(
      and(
        eq(workoutPlans.userId, userId),
        eq(workoutPlans.weekNumber, weekNumber)
      )
    )
    .limit(1);

  if (!plan) return 0;

  // Atualizar difficultyMultiplier
  await db
    .update(workoutPlans)
    .set({ difficultyMultiplier })
    .where(eq(workoutPlans.id, plan.id));

  // Ajustar volume (sets)
  const workoutsInPlan = await db
    .select()
    .from(workouts)
    .where(eq(workouts.planId, plan.id));

  for (const workout of workoutsInPlan) {
    await db
      .update(workoutExercises)
      .set({
        sets: sql`CAST(MAX(2, sets + ${volumeAdjustment}) AS INTEGER)`
      })
      .where(eq(workoutExercises.workoutId, workout.id));
  }

  return 0; // TODO: implement exercise swapping
}
```

**Cron Job Handler:**
```typescript
// apps/api/src/cron/weekly-adjustment.ts
export async function handleWeeklyAdjustment(env: Env) {
  const db = drizzle(env.DB);

  // Buscar todos usuários ativos
  const activeUsers = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(
      and(
        eq(profiles.onboardingCompletedAt, sql`NOT NULL`),
        gte(profiles.currentWeek, 1)
      )
    );

  console.log(`[Cron] Processing ${activeUsers.length} active users`);

  const results = [];

  for (const user of activeUsers) {
    try {
      const result = await adjustWeeklyWorkouts(db, user.userId);
      results.push(result);
    } catch (error) {
      console.error(`[Cron] Error adjusting user ${user.userId}:`, error);
    }
  }

  console.log(`[Cron] Adjusted ${results.length} users successfully`);

  return {
    success: true,
    processed: activeUsers.length,
    adjusted: results.length,
    timestamp: new Date().toISOString(),
  };
}
```

**wrangler.toml (já configurado):**
```toml
[triggers]
crons = ["0 6 * * 1"] # Segunda-feira 6am UTC
```

**Index.ts:**
```typescript
// apps/api/src/index.ts
app.get('/cron/weekly-adjustment', async (c) => {
  // Validar cron secret
  const cronSecret = c.req.header('X-Cloudflare-Cron-Secret');
  if (cronSecret !== c.env.CRON_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const result = await handleWeeklyAdjustment(c.env);
  return c.json(result);
});
```

---

### 1.3 Push Notifications (Service Worker)

**Status Atual:** Não implementado
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 2-3 dias
**Dependências:** Service Worker configurado

#### Implementação:

**Service Worker (apps/web/public/sw.js):**
```javascript
// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data,
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ],
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});
```

**Frontend - Subscription:**
```typescript
// apps/web/src/lib/notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPush(userId: string): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Enviar subscription para backend
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      subscription: subscription.toJSON(),
    }),
  });

  return subscription;
}
```

**Backend - Push Endpoint:**
```typescript
// apps/api/src/handlers/notifications.ts
import webpush from 'web-push';

// Configurar VAPID keys
webpush.setVapidDetails(
  'mailto:contato@fitpro.vip',
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

export async function subscribeToPush(c: Context) {
  const userId = c.get('userId');
  const { subscription } = await c.req.json();

  // Salvar subscription no D1
  await db.insert(pushSubscriptions).values({
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });

  return c.json({ success: true });
}

export async function sendPushNotification(
  userId: string,
  notification: { title: string; body: string; data?: any }
) {
  // Buscar subscriptions do usuário
  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          }
        },
        JSON.stringify(notification)
      );
    } catch (error) {
      // Se subscription expirou, remover do banco
      if (error.statusCode === 410) {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.id, sub.id));
      }
    }
  }
}
```

**Notificações Automáticas:**
```typescript
// Tipos de notificação
const NOTIFICATIONS = {
  STREAK_REMINDER: {
    title: '🔥 Não perca sua sequência!',
    body: 'Você está há {hours}h sem treinar. Mantenha o ritmo!',
    trigger: 'após 20h sem workout',
  },
  ACHIEVEMENT_UNLOCK: {
    title: '🏆 Nova conquista desbloqueada!',
    body: '{achievement_name} - {achievement_description}',
    trigger: 'ao desbloquear achievement',
  },
  WEEKLY_SUMMARY: {
    title: '📊 Resumo Semanal',
    body: 'Você completou {count} treinos esta semana! Parabéns!',
    trigger: 'domingo 18h',
  },
  NEXT_WORKOUT: {
    title: '💪 Próximo treino: {workout_type}',
    body: 'Programado para hoje. Vamos lá!',
    trigger: 'dia de treino às 8h',
  }
};
```

**Database Schema:**
```sql
CREATE TABLE push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  UNIQUE(user_id, endpoint)
);
```

---

## 🎯 FASE 2: FEATURES AVANÇADAS (Prioridade: MÉDIA)

### 2.1 Sistema de Analytics Avançado

**Status Atual:** Não implementado
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 3-4 dias

#### Features:

**Dashboard de Analytics (Admin):**
- Total usuários ativos/inativos
- Taxa de retenção (7-day, 30-day)
- Taxa de conclusão de treinos (por semana)
- Exercícios mais populares
- Taxa de churn
- Crescimento semanal/mensal

**User Analytics (Per-user):**
- Volume total levantado (tracking de carga)
- Tempo total de treino acumulado
- Músculos mais treinados (heatmap)
- Progressão de força (tracking de peso/reps)
- Gráficos de evolução semanal/mensal

**Implementação:**
```typescript
// apps/api/src/handlers/analytics.ts

export async function getUserAnalytics(c: Context) {
  const userId = c.get('userId');
  const timeRange = c.req.query('range') || '30d'; // 7d, 30d, 90d, 1y

  const analytics = {
    volumeLifted: await calculateTotalVolume(userId, timeRange),
    totalWorkouts: await getTotalWorkouts(userId, timeRange),
    totalMinutes: await getTotalMinutes(userId, timeRange),
    muscleDistribution: await getMuscleDistribution(userId, timeRange),
    strengthProgression: await getStrengthProgression(userId, timeRange),
    consistency: await getConsistencyScore(userId, timeRange),
    personalRecords: await getPersonalRecords(userId),
  };

  return c.json(analytics);
}

async function calculateTotalVolume(userId: string, range: string) {
  // Volume = Sets × Reps × Peso
  // Precisa de tracking de peso por set (nova feature)
  return {
    total: 0, // kg
    byMuscleGroup: {},
    trend: [], // array de pontos no tempo
  };
}
```

**Database Schema (nova tabela):**
```sql
CREATE TABLE workout_set_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id),
  set_number INTEGER NOT NULL,
  reps_completed INTEGER NOT NULL,
  weight_kg REAL,
  perceived_difficulty INTEGER CHECK(perceived_difficulty BETWEEN 1 AND 10),
  completed_at INTEGER NOT NULL,
  INDEX idx_user_date (user_id, completed_at),
  INDEX idx_workout_exercise (workout_exercise_id)
);
```

**Frontend - Analytics Dashboard:**
```typescript
// apps/web/src/pages/Analytics.tsx
import { AreaChart, BarChart, PieChart } from 'recharts';

export default function AnalyticsPage() {
  const { data } = useAnalytics('30d');

  return (
    <div>
      <h1>Análise de Progresso</h1>

      {/* Total Volume Card */}
      <Card>
        <CardTitle>Volume Total Levantado</CardTitle>
        <AreaChart data={data.volumeTrend} />
      </Card>

      {/* Muscle Distribution */}
      <Card>
        <CardTitle>Distribuição de Músculos</CardTitle>
        <PieChart data={data.muscleDistribution} />
      </Card>

      {/* Strength Progression */}
      <Card>
        <CardTitle>Progressão de Força</CardTitle>
        <LineChart data={data.strengthProgression} />
      </Card>

      {/* Personal Records */}
      <Card>
        <CardTitle>Recordes Pessoais</CardTitle>
        <RecordsList records={data.personalRecords} />
      </Card>
    </div>
  );
}
```

---

### 2.2 Social Features & Leaderboards

**Status Atual:** Não implementado
**Prioridade:** 🟢 BAIXA
**Estimativa:** 5-7 dias

#### Features:

**Leaderboards:**
- Global leaderboard (total workouts, current streak)
- Amigos leaderboard (apenas friends)
- Filtros: semanal, mensal, all-time
- Categorias: volume, consistência, streak

**Social:**
- Sistema de amigos (friend requests)
- Perfil público (opt-in)
- Compartilhamento de conquistas (social share)
- Comentários em conquistas
- Challenges entre amigos

**Database Schema:**
```sql
CREATE TABLE friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  friend_id TEXT NOT NULL REFERENCES users(id),
  status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  accepted_at INTEGER,
  UNIQUE(user_id, friend_id),
  CHECK(user_id != friend_id)
);

CREATE TABLE activity_feed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  activity_type TEXT CHECK(activity_type IN ('workout_completed', 'achievement_unlocked', 'streak_milestone')),
  data JSON NOT NULL,
  created_at INTEGER NOT NULL,
  INDEX idx_user_date (user_id, created_at)
);

CREATE TABLE leaderboards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  category TEXT NOT NULL,
  period TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  INDEX idx_category_period_rank (category, period, rank),
  UNIQUE(user_id, category, period)
);
```

**API Endpoints:**
```
GET  /api/social/leaderboard?category=workouts&period=week
GET  /api/social/friends
POST /api/social/friends/request
POST /api/social/friends/:id/accept
DELETE /api/social/friends/:id
GET  /api/social/activity-feed
POST /api/social/share/:achievementId
```

---

### 2.3 Tracking de Peso & Medidas Corporais

**Status Atual:** Campos existem em profiles mas não há tracking over time
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 2 dias

#### Features:

**Body Metrics Tracking:**
- Peso semanal
- Medidas corporais (cintura, braço, perna, etc.)
- Fotos de progresso (antes/depois)
- Gráficos de evolução
- Meta de peso

**Database Schema:**
```sql
CREATE TABLE body_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  weight_kg REAL,
  body_fat_percentage REAL,
  waist_cm REAL,
  chest_cm REAL,
  arm_cm REAL,
  thigh_cm REAL,
  photo_url TEXT,
  notes TEXT,
  measured_at INTEGER NOT NULL,
  INDEX idx_user_date (user_id, measured_at)
);
```

**Frontend Component:**
```typescript
// apps/web/src/pages/BodyMetrics.tsx
export default function BodyMetrics() {
  const { data } = useBodyMetrics();

  return (
    <div>
      <h1>Medidas Corporais</h1>

      {/* Weight Chart */}
      <Card>
        <LineChart data={data.weightHistory} />
      </Card>

      {/* Add New Measurement */}
      <MeasurementForm />

      {/* Progress Photos */}
      <ProgressPhotosGrid photos={data.photos} />
    </div>
  );
}
```

---

## 🎯 FASE 3: FEATURES DE IA/ML (Prioridade: BAIXA - Futuro)

### 3.1 Recomendação Inteligente de Treinos

**Status:** Conceitual
**Prioridade:** 🟢 BAIXA
**Estimativa:** 10+ dias

#### Conceito:

**Machine Learning Model:**
- Input: histórico de treinos, feedback, taxa de conclusão, injuries
- Output: recomendação personalizada de próximos exercícios
- Técnica: Collaborative Filtering ou Neural Network

**Features:**
- Predizer quais exercícios o usuário mais vai gostar
- Sugerir variações baseado em padrões de outros usuários similares
- Auto-ajustar dificuldade baseado em padrões históricos

**Stack Sugerido:**
- TensorFlow.js (inference no browser)
- Python backend para training (offline)
- Cloudflare ML (quando disponível)

---

### 3.2 Form Check com Computer Vision

**Status:** Conceitual
**Prioridade:** 🟢 BAIXA
**Estimativa:** 20+ dias

#### Conceito:

**Computer Vision:**
- Usar webcam/câmera do celular
- Pose estimation (MediaPipe ou TensorFlow Pose)
- Detectar erros de forma em tempo real
- Dar feedback durante execução

**Features:**
- "Seu joelho está passando da ponta do pé"
- "Mantenha as costas retas"
- Rep counter automático
- Score de qualidade da execução

---

## 🎯 FASE 4: MELHORIAS DE PERFORMANCE & ESCALABILIDADE

### 4.1 Otimizações de Database

**Implementar:**
- Índices compostos adicionais
- Materialized views (cache de queries complexas)
- Particionamento por data (workout_history)
- Limpeza automática de dados antigos (GDPR compliance)

```sql
-- Índices compostos
CREATE INDEX idx_workouts_user_status_date ON workouts(user_id, status, completed_at);
CREATE INDEX idx_workout_exercises_workout_order ON workout_exercises(workout_id, order_index);

-- Materialized view para stats do usuário (atualizada via trigger)
CREATE TABLE user_stats_cache (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  total_workouts INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  completion_rate REAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_updated INTEGER NOT NULL
);

-- Trigger para atualizar cache
CREATE TRIGGER update_user_stats_on_workout_complete
AFTER UPDATE OF status ON workouts
WHEN NEW.status = 'completed'
BEGIN
  UPDATE user_stats_cache
  SET total_workouts = total_workouts + 1,
      last_updated = strftime('%s', 'now')
  WHERE user_id = NEW.user_id;
END;
```

### 4.2 Caching Strategy

**Implementar:**
- Cloudflare Cache API para assets estáticos
- KV storage para user sessions
- Durable Objects para real-time features
- Redis-like caching com Cloudflare Cache

```typescript
// apps/api/src/lib/cache-manager.ts
export class CacheManager {
  private cache: Cache;

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.cache.match(key);
    if (!cached) return null;

    return cached.json();
  }

  async set<T>(key: string, value: T, ttl: number = 300) {
    const response = new Response(JSON.stringify(value), {
      headers: {
        'Cache-Control': `max-age=${ttl}`,
        'Content-Type': 'application/json',
      }
    });

    await this.cache.put(key, response);
  }
}

// Usar em endpoints
export async function getWorkoutPlan(c: Context) {
  const cacheKey = `workout-plan:${userId}:${weekNumber}`;

  // Try cache first
  let data = await cache.get(cacheKey);
  if (data) return c.json(data);

  // Fetch from DB
  data = await fetchWorkoutPlanFromDB(userId, weekNumber);

  // Cache for 5 minutes
  await cache.set(cacheKey, data, 300);

  return c.json(data);
}
```

### 4.3 CDN & Asset Optimization

**Implementar:**
- Image optimization (Cloudflare Images)
- Video streaming otimizado (HLS/DASH)
- Lazy loading avançado
- Code splitting por rota

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@/components/ui'],
          'charts': ['recharts'],
          'forms': ['react-hook-form', 'zod'],
        }
      }
    }
  }
});
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Completar Features (Semanas 1-2)
- [ ] 1.1 Sistema de Vídeos
  - [ ] Criar R2 bucket
  - [ ] Configurar wrangler.toml
  - [ ] Implementar endpoints de streaming
  - [ ] Processar e upload de 10 vídeos MVP
  - [ ] Atualizar database com URLs
  - [ ] Testar playback em produção

- [ ] 1.2 Weekly Adjustment
  - [ ] Reescrever workout-adjuster.ts para D1
  - [ ] Implementar cron handler
  - [ ] Configurar cron secret
  - [ ] Testar ajustes com usuários reais
  - [ ] Deploy e monitorar logs

- [ ] 1.3 Push Notifications
  - [ ] Configurar Service Worker
  - [ ] Gerar VAPID keys
  - [ ] Implementar subscription endpoint
  - [ ] Criar notification templates
  - [ ] Testar em iOS/Android
  - [ ] Implementar opt-out

### Fase 2: Features Avançadas (Semanas 3-5)
- [ ] 2.1 Analytics
  - [ ] Criar tabela workout_set_logs
  - [ ] Implementar tracking de peso/reps
  - [ ] Criar endpoints de analytics
  - [ ] Desenvolver dashboard UI
  - [ ] Gráficos de progressão

- [ ] 2.2 Social Features
  - [ ] Criar schema de friendships
  - [ ] Implementar friend requests
  - [ ] Criar leaderboards
  - [ ] Activity feed
  - [ ] Social sharing

- [ ] 2.3 Body Metrics
  - [ ] Criar tabela body_measurements
  - [ ] Form de entrada de medidas
  - [ ] Upload de fotos de progresso
  - [ ] Gráficos de evolução

### Fase 3: IA/ML (Futuro - Meses 2-3)
- [ ] 3.1 ML Recommendations
  - [ ] Coletar dataset de treinos
  - [ ] Treinar modelo de recomendação
  - [ ] Implementar inference

- [ ] 3.2 Form Check
  - [ ] Integrar MediaPipe
  - [ ] Pose detection
  - [ ] Feedback em tempo real

### Fase 4: Performance (Contínuo)
- [ ] 4.1 Database Optimization
  - [ ] Criar índices adicionais
  - [ ] Materialized views
  - [ ] Query optimization

- [ ] 4.2 Caching
  - [ ] Cloudflare Cache API
  - [ ] KV storage para sessions
  - [ ] Cache invalidation strategy

- [ ] 4.3 Asset Optimization
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Lazy loading avançado

---

## 🎯 PRIORIZAÇÃO RECOMENDADA

### Sprint 1 (Semana 1-2) - CRÍTICO
1. **Sistema de Vídeos** (10 vídeos MVP)
2. **Weekly Adjustment** (reativar)

### Sprint 2 (Semana 3) - IMPORTANTE
3. **Push Notifications** (engajamento)
4. **Body Metrics Tracking** (valor agregado)

### Sprint 3 (Semana 4-5) - MELHORIAS
5. **Analytics Dashboard** (retenção)
6. **Performance Optimization** (escalabilidade)

### Backlog (Meses 2-3) - FUTURO
7. **Social Features** (viralização)
8. **ML Recommendations** (diferenciação)
9. **Form Check** (inovação)

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs por Fase:

**Fase 1:**
- [ ] 90%+ dos usuários assistem pelo menos 1 vídeo
- [ ] Weekly adjustment roda sem erros para 100% dos usuários
- [ ] Push notifications têm opt-in rate > 40%

**Fase 2:**
- [ ] 60%+ dos usuários ativos checam analytics semanalmente
- [ ] Social features aumentam retenção em 20%
- [ ] Body tracking usado por 50%+ dos usuários

**Fase 3:**
- [ ] ML recommendations aumentam satisfação em 25%
- [ ] Form check reduz lesões em 30%

**Fase 4:**
- [ ] API response time < 200ms (p95)
- [ ] Zero downtime durante carga de pico
- [ ] Custos de infraestrutura < $100/mês para 1000 usuários

---

## 🚀 DEPLOYMENT STRATEGY

### Continuous Deployment:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm deploy:production
```

### Feature Flags:
```typescript
// lib/feature-flags.ts
export const FEATURES = {
  VIDEOS_ENABLED: env.FEATURE_VIDEOS === 'true',
  PUSH_NOTIFICATIONS: env.FEATURE_PUSH === 'true',
  SOCIAL_FEATURES: env.FEATURE_SOCIAL === 'true',
  ML_RECOMMENDATIONS: env.FEATURE_ML === 'true',
};

// Usage
if (FEATURES.VIDEOS_ENABLED) {
  return <VideoPlayer src={videoUrl} />;
}
```

### A/B Testing:
- Testar novas features com 10% dos usuários primeiro
- Medir impacto em retenção/engajamento
- Rollout gradual (10% → 50% → 100%)

---

## 📝 CONCLUSÃO

Este roadmap cobre:
- ✅ **Completar 100%** das features planejadas originalmente
- ✅ **Reimplementar** sistemas migrados (Weekly Adjustment)
- ✅ **Adicionar** features avançadas para diferenciação competitiva
- ✅ **Otimizar** performance e escalabilidade
- ✅ **Preparar** para crescimento exponencial

**Próximos Passos Imediatos:**
1. Iniciar Sprint 1: Sistema de Vídeos (Fase 1.1)
2. Reativar Weekly Adjustment (Fase 1.2)
3. Planejar infraestrutura de Push Notifications (Fase 1.3)

**Timeline Estimado:**
- **Fase 1**: 2-3 semanas
- **Fase 2**: 3-4 semanas
- **Fase 3**: 2-3 meses (paralelo com operação)
- **Fase 4**: Contínuo

---

*Documento criado em: 11 de Janeiro de 2026*
*Última atualização: 11 de Janeiro de 2026*
*Versão: 1.0*
