# Sprint 2 - Sistema de Vídeos de Exercícios 🎥

**Data**: 04/01/2026
**Status**: 🟡 **PLANEJAMENTO**
**Duração estimada**: 3-5 horas

---

## 🎯 Objetivos do Sprint

Implementar sistema completo de vídeos de exercícios usando Cloudflare R2, com player otimizado, thumbnails, e experiência mobile-first.

**Impacto esperado**:
- [OK] **+40% completude de exercícios** (usuários entendem a forma correta)
- [OK] **-60% taxa de lesões** (demonstração visual previne erros)
- [OK] **+25% retenção D7** (conteúdo premium aumenta valor percebido)

---

## 📚 Pesquisa Realizada

### Cloudflare R2 para Vídeos

**Fontes**:
- [Cloudflare R2 Overview](https://developers.cloudflare.com/r2/)
- [Testing Cloudflare R2 for Video Storage](https://adocasts.com/blog/testing-cloudflare-r2-for-video-storage)
- [Delivering 4K Video with R2 for $2.18](https://screencasting.com/cheap-video-hosting)

**Principais descobertas**:
- [OK] R2 suporta streaming de vídeo com headers 206 (partial content)
- [OK] Free tier: 10 GB storage + 10M requests/mês
- [OK] **Zero egress fees** (economia massiva vs S3)
- [OK] Compatível com S3 API (usar tools como rclone)
- [!] **Evitar MP4 grandes diretos** (pode cortar antes do fim)
- [OK] **Best practice**: HLS format (.m3u8 + .ts chunks) para vídeos >2min
- [OK] Workers para controle de acesso e caching

**Para nosso caso** (vídeos curtos 15-45s):
- MP4 com H.264 funciona bem para demos de exercício
- Usar workers para servir vídeos privados
- CDN cache automático via Cloudflare

### Formatos e Otimização

**Fontes**:
- [Best Video Format for Web 2026](https://www.shopify.com/blog/best-video-format-web)
- [Optimizing Video For Size And Quality](https://www.smashingmagazine.com/2021/02/optimizing-video-size-quality/)
- [Mobile Video Optimization](https://cloudinary.com/guides/video-effects/simplify-mobile-video-optimization)

**Recomendações para exercícios fitness**:
```
Formato: MP4 (H.264 codec)
Resolução: 720p (1280x720)
Bitrate: 1.5-2 Mbps
FPS: 30fps
Duração: 15-45 segundos
Tamanho médio: 3-8 MB por vídeo
```

**Por que 720p e não 1080p?**
- Mobile representa 70%+ do tráfego
- 720p é nítido o suficiente para ver forma do exercício
- Metade do tamanho de arquivo vs 1080p
- Carrega 2x mais rápido em 4G/5G

### Player HTML5 + React

**Fontes**:
- [Lazy-Load Videos in Next.js](https://cloudinary.com/blog/lazy-load-videos-in-next-js-pages)
- [Next.js Video Optimization](https://github.com/vercel/next.js/discussions/20323)
- [Building Feature-Rich Next.js Video Player](https://cloudinary.com/guides/front-end-development/next-js-video-player)

**Estratégias implementadas**:
1. **Lazy Loading**: Intersection Observer API
2. **Preload control**: `preload="metadata"` (só carrega primeiro frame)
3. **Native HTML5**: Sem dependências extras
4. **Loop automático**: Ideal para demos de exercício
5. **Muted autoplay**: Permitido por todos navegadores

---

## 🏗️ Arquitetura da Solução

### 1. Storage Layer (Cloudflare R2)

```
R2 Bucket: fitness-pro-videos
├── exercises/
│   ├── flexao.mp4 (720p, 20s, ~4MB)
│   ├── flexao-thumb.jpg (640x360, ~50KB)
│   ├── agachamento.mp4
│   ├── agachamento-thumb.jpg
│   └── ... (30 vídeos totais)
└── README.md
```

**Nomenclatura**: `{exercise-slug}.mp4` e `{exercise-slug}-thumb.jpg`

### 2. API Layer (Cloudflare Worker)

**Novo endpoint**: `GET /api/exercises/:slug/video`

Benefícios:
- [OK] Autenticação (só usuários logados)
- [OK] Rate limiting
- [OK] Analytics de visualização
- [OK] CDN cache headers
- [OK] Assinatura de URL (evita hotlinking)

### 3. Database Layer (Postgres via Neon)

**Schema atual** (`packages/database/src/schema.ts` linhas 42-43):
```typescript
videoUrl: varchar('video_url', { length: 500 }),       // [OK] JÁ EXISTE
thumbnailUrl: varchar('thumbnail_url', { length: 500 }), // [OK] JÁ EXISTE
```

**Nenhuma migração necessária!** 🎉

Precisamos apenas popular esses campos:
```sql
UPDATE exercises
SET
  video_url = 'https://r2.fitness-pro.com/exercises/flexao.mp4',
  thumbnail_url = 'https://r2.fitness-pro.com/exercises/flexao-thumb.jpg'
WHERE slug = 'flexao';
```

### 4. Frontend Layer (Next.js + React)

**Componente atualizado**: `ExerciseCard.tsx`

```typescript
interface VideoPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  exerciseName: string;
}

function VideoPlayer({ videoUrl, thumbnailUrl, exerciseName }: VideoPlayerProps) {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  if (!videoUrl) {
    return <VideoPlaceholder />;
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnailUrl || undefined}
        preload={isInView ? "metadata" : "none"}
        loop
        muted
        playsInline
        controls
        aria-label={`Vídeo demonstrativo de ${exerciseName}`}
      >
        <source src={videoUrl} type="video/mp4" />
        <p>Seu navegador não suporta vídeos HTML5.</p>
      </video>

      {/* Play indicator overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="bg-black/30 rounded-full p-3">
          <PlayIcon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
```

**Features**:
- [OK] Lazy loading (só carrega quando visível)
- [OK] Thumbnail como poster frame
- [OK] Loop automático (demos repetem)
- [OK] Muted (autoplay funciona)
- [OK] Controls nativos do browser
- [OK] Accessibility (aria-label)
- [OK] Fallback para navegadores antigos
- [OK] Overlay play indicator

---

## 📋 Tarefas de Implementação

### Fase 1: Setup Cloudflare R2 (1 hora)

- [ ] **1.1** Criar R2 bucket `fitness-pro-videos`
  - Dashboard Cloudflare → R2 → Create Bucket
  - Região: Automatic (nearest to users)
  - Public access: Disabled (usar Workers)

- [ ] **1.2** Configurar custom domain para R2
  - Criar subdomain: `videos.fitness-pro.com`
  - Apontar para R2 bucket via Workers

- [ ] **1.3** Obter credenciais S3-compatible
  - API Token com permissões: `R2:Read`, `R2:Write`
  - Salvar em `packages/database/.env`:
    ```
    R2_ACCOUNT_ID=xxx
    R2_ACCESS_KEY_ID=xxx
    R2_SECRET_ACCESS_KEY=xxx
    R2_BUCKET_NAME=fitness-pro-videos
    ```

- [ ] **1.4** Instalar rclone para upload
  ```bash
  # Windows: winget install Rclone.Rclone
  # Mac: brew install rclone
  # Linux: sudo apt install rclone

  rclone config create r2 s3 \
    provider=Cloudflare \
    access_key_id=$R2_ACCESS_KEY_ID \
    secret_access_key=$R2_SECRET_ACCESS_KEY \
    endpoint=https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com
  ```

### Fase 2: Preparar Vídeos (2-3 horas)

**Opção A**: Usar vídeos gratuitos de exercícios

Fontes recomendadas:
- [Pexels Fitness Videos](https://www.pexels.com/search/videos/exercise/)
- [Mixkit Workout Videos](https://mixkit.co/free-stock-video/workout/)
- [Videvo Exercise Demos](https://www.videvo.net/search/exercise/)

**Opção B**: Criar mock vídeos (para MVP)

Usar placeholders de texto mostrando nome do exercício (5min cada):
```bash
# Gerar vídeo placeholder com ffmpeg
ffmpeg -f lavfi -i color=c=gray:s=1280x720:d=10 \
       -vf "drawtext=text='FLEXÃO DE BRAÇO':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
       -c:v libx264 -t 10 flexao.mp4
```

**Processo por vídeo**:
1. Baixar vídeo raw (1080p ou 720p)
2. Cortar para 15-45s (melhor parte da demonstração)
3. Converter para otimizado:
   ```bash
   ffmpeg -i input.mp4 -vf scale=1280:720 \
          -c:v libx264 -preset slow -crf 23 \
          -c:a aac -b:a 128k \
          -movflags +faststart \
          output.mp4
   ```
4. Gerar thumbnail (frame do meio):
   ```bash
   ffmpeg -i output.mp4 -ss 00:00:03 -vframes 1 \
          -vf scale=640:360 \
          output-thumb.jpg
   ```
5. Upload para R2:
   ```bash
   rclone copy output.mp4 r2:fitness-pro-videos/exercises/
   rclone copy output-thumb.jpg r2:fitness-pro-videos/exercises/
   ```

**Lista de vídeos prioritários** (MVP - 10 vídeos):
1. [OK] Flexão de Braço (flexao.mp4)
2. [OK] Agachamento (agachamento.mp4)
3. [OK] Prancha Abdominal (prancha.mp4)
4. [OK] Afundo (afundo.mp4)
5. [OK] Supino Reto (supino-reto.mp4)
6. [OK] Remada Curvada (remada-curvada.mp4)
7. [OK] Desenvolvimento (desenvolvimento.mp4)
8. [OK] Rosca Direta (rosca-direta.mp4)
9. [OK] Tríceps Pulley (triceps-pulley.mp4)
10. [OK] Leg Press (leg-press.mp4)

**Fase 2 (depois)**: Adicionar os 20 vídeos restantes

### Fase 3: Worker para Servir Vídeos (30min)

**Arquivo**: `apps/api/src/handlers/videos.ts`

```typescript
import { Context } from 'hono';

interface Env {
  R2_BUCKET: R2Bucket; // Cloudflare R2 binding
}

export async function getExerciseVideo(c: Context<{ Bindings: Env }>) {
  const slug = c.req.param('slug');
  const videoKey = `exercises/${slug}.mp4`;

  try {
    const object = await c.env.R2_BUCKET.get(videoKey);

    if (!object) {
      return c.json({ error: 'Video not found' }, 404);
    }

    // Support range requests (seek in video)
    const range = c.req.header('Range');
    if (range) {
      // TODO: Implement byte-range support
      // For now, return full video
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
```

**Registrar route** (`apps/api/src/index.ts`):
```typescript
import { getExerciseVideo } from './handlers/videos';

app.get('/api/exercises/:slug/video', clerkAuth, getExerciseVideo);
```

**Configurar R2 binding** (`apps/api/wrangler.toml`):
```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "fitness-pro-videos"
```

### Fase 4: Atualizar Database (15min)

**Script**: `scripts/update-video-urls.ts`

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { exercises } from '../packages/database/src/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../packages/database/.env' });

const VIDEO_BASE_URL = 'https://api.fitness-pro.com/api/exercises';

const VIDEO_MAPPINGS = [
  { slug: 'flexao', hasVideo: true },
  { slug: 'agachamento', hasVideo: true },
  { slug: 'prancha', hasVideo: true },
  // ... adicionar outros 7 do MVP
];

async function updateVideoUrls() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  for (const mapping of VIDEO_MAPPINGS) {
    if (mapping.hasVideo) {
      await db
        .update(exercises)
        .set({
          videoUrl: `${VIDEO_BASE_URL}/${mapping.slug}/video`,
          thumbnailUrl: `${VIDEO_BASE_URL}/${mapping.slug}/thumbnail`,
        })
        .where(eq(exercises.slug, mapping.slug));

      console.log(`✓ Updated ${mapping.slug}`);
    }
  }

  console.log('\n[OK] All video URLs updated!');
}

updateVideoUrls();
```

### Fase 5: Implementar Video Player (1 hora)

**Arquivo**: `apps/web/src/components/workout/VideoPlayer.tsx`

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  exerciseName: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, exerciseName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25, rootMargin: '50px' }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback to placeholder if no video
  if (!videoUrl || hasError) {
    return (
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <div className="flex aspect-video items-center justify-center text-gray-400">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm">
              {hasError ? 'Erro ao carregar vídeo' : 'Vídeo em breve'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={thumbnailUrl || undefined}
        preload={isInView ? 'metadata' : 'none'}
        loop
        muted
        playsInline
        controls
        onError={() => setHasError(true)}
        aria-label={`Vídeo demonstrativo: ${exerciseName}`}
      >
        <source src={videoUrl} type="video/mp4" />
        <p className="p-4 text-white">
          Seu navegador não suporta reprodução de vídeos HTML5.
        </p>
      </video>
    </div>
  );
}
```

**Atualizar ExerciseCard**:
```typescript
import { VideoPlayer } from './VideoPlayer';

// ... dentro do CardContent
<VideoPlayer
  videoUrl={exercise.videoUrl}
  thumbnailUrl={exercise.thumbnailUrl}
  exerciseName={exercise.exerciseName}
/>
```

### Fase 6: Atualizar API Client (15min)

**Arquivo**: `apps/web/src/lib/api-client.ts`

Adicionar campos videoUrl e thumbnailUrl no tipo WorkoutExercise:
```typescript
export interface WorkoutExercise {
  id: number;
  exerciseName: string;
  muscleGroups: string[];
  sets: number;
  repsMin: number | null;
  repsMax: number | null;
  restSeconds: number;
  difficulty: string;
  notesPt: string | null;
  videoUrl: string | null;        // [OK] ADD
  thumbnailUrl: string | null;    // [OK] ADD
}
```

**Arquivo**: `apps/api/src/handlers/training.ts`

Incluir videoUrl e thumbnailUrl nas queries:
```typescript
// Linha ~100 (getWorkoutPlan)
const workoutExerciseRecords = await db
  .select({
    // ... existing fields
    videoUrl: exercises.videoUrl,        // [OK] ADD
    thumbnailUrl: exercises.thumbnailUrl, // [OK] ADD
  })
  // ... rest of query
```

### Fase 7: Testes e Validação (30min)

- [ ] **7.1** Testar upload para R2
  - Fazer upload de 1 vídeo teste
  - Verificar URL funciona no browser
  - Confirmar cache headers

- [ ] **7.2** Testar API endpoint
  - `curl https://api.fitness-pro.com/api/exercises/flexao/video`
  - Verificar stream funciona
  - Testar com/sem autenticação

- [ ] **7.3** Testar frontend
  - Vídeo carrega corretamente
  - Lazy loading funciona (scroll para baixo/cima)
  - Thumbnail aparece antes do load
  - Controls funcionam (play/pause/seek)
  - Loop automático funciona
  - Mobile responsivo

- [ ] **7.4** Performance testing
  - Lighthouse score (deve manter >90)
  - Network tab: vídeo só carrega quando visível
  - Mobile 4G simulation: tempo de load aceitável

- [ ] **7.5** Accessibility
  - Screen reader lê corretamente
  - Keyboard navigation funciona
  - Contraste adequado nos overlays

---

## 📊 Métricas de Sucesso

### Técnicas
- [OK] 10 vídeos de alta qualidade no ar
- [OK] Tempo de load <2s em 4G
- [OK] Lazy loading reduz data usage em 60%
- [OK] Zero erros de streaming
- [OK] Lighthouse score mantém >90

### Negócio
- [OK] +40% usuários completam exercícios após ver vídeo
- [OK] +25% retenção D7
- [OK] -60% perguntas de suporte sobre "como fazer exercício X"
- [OK] NPS aumenta de 7 para 8+

---

## 🚧 Considerações e Trade-offs

### O que NÃO vamos fazer (por enquanto)

[X] **Picture-in-Picture**: Complexo, baixo ROI
[X] **Playback speed control**: Pode ensinar forma errada
[X] **Download offline**: PWA já cacheia assets
[X] **Multi-ângulo**: Muito custo de produção
[X] **Legendas/closed captions**: Poucos exercícios têm áudio importante

### Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Vídeos com copyright | Médio | Alto | Usar apenas fontes com licença livre (Pexels, Mixkit) |
| R2 storage cheio | Baixo | Médio | Monitorar usage, comprimir vídeos, free tier é 10GB |
| Player quebra em iOS Safari | Baixo | Alto | Testar extensivamente, usar `playsInline` |
| Load time ruim em 3G | Médio | Médio | Thumbnail + lazy load minimiza impacto |
| Custo de bandwidth escala | Baixo | Baixo | R2 não cobra egress, CDN cache resolve |

---

## 📦 Deliverables

1. [OK] Cloudflare R2 bucket configurado e funcionando
2. [OK] 10 vídeos de exercícios otimizados (720p MP4)
3. [OK] 10 thumbnails gerados (640x360 JPG)
4. [OK] Worker endpoint `/api/exercises/:slug/video`
5. [OK] Componente `VideoPlayer.tsx` com lazy loading
6. [OK] ExerciseCard integrado com vídeos
7. [OK] Database populado com URLs
8. [OK] Testes de performance passando
9. [OK] Documentação de deployment

---

## 🔄 Próximos Passos (Pós-Sprint 2)

### Sprint 2.5 (Opcional - Melhorias)
- [ ] Adicionar os 20 vídeos restantes
- [ ] Analytics de visualização (qual vídeo mais assistido)
- [ ] Quality selector (720p/480p/360p para 3G)
- [ ] Progress tracking (usuário assistiu X% do vídeo)

### Sprint 3 - Engajamento
- [ ] Push notifications
- [ ] Streaks e badges
- [ ] Gamificação básica

---

## 💰 Estimativa de Custos

### Cloudflare R2 (Free Tier)
- Storage: 10 GB/mês (30 vídeos x ~5MB = 150MB) [OK] FREE
- Requests: 10M Class B/mês (estimado 50k/mês) [OK] FREE
- Egress: **ZERO** (diferencial vs S3)

**Custo mensal projetado**: **$0.00** 🎉

### Produção de Vídeos

**Opção A** (vídeos gratuitos):
- Custo: $0
- Tempo: ~30min por vídeo (busca, corte, otimização)
- Total: 5 horas para 10 vídeos

**Opção B** (produção própria no futuro):
- Custo: R$150-300 por vídeo (contratar PT)
- Qualidade: Alta, branded
- Total: R$4.500 para 30 vídeos

**Para MVP**: Usar Opção A

---

## [OK] Checklist Final

Antes de marcar Sprint 2 como completo:

- [ ] R2 bucket criado e acessível
- [ ] 10 vídeos uploadados e streaming
- [ ] 10 thumbnails funcionando
- [ ] Worker endpoint testado
- [ ] VideoPlayer componente implementado
- [ ] ExerciseCard atualizado
- [ ] Database URLs populadas
- [ ] API retorna videoUrl/thumbnailUrl
- [ ] Frontend mostra vídeos corretamente
- [ ] Lazy loading validado
- [ ] Performance Lighthouse >90
- [ ] Mobile Safari testado
- [ ] Documentação atualizada
- [ ] Commits organizados
- [ ] README com instruções de R2 setup

---

**Documentado por**: Claude Code
**Data**: 04/01/2026
**Versão**: 1.0.0 (Sprint 2 Planning)
