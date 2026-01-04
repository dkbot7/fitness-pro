# Fitness Pro - Video Assets 🎥

This directory contains exercise demonstration videos for the Fitness Pro app.

## Directory Structure

```
videos/
├── exercises/          # Optimized exercise videos
│   ├── flexao.mp4     # Processed 720p videos
│   ├── flexao-thumb.jpg  # Video thumbnails (640x360)
│   └── ...
└── README.md          # This file
```

##Cloud Storage Setup (Cloudflare R2)

### Prerequisites

1. **Cloudflare Account** with R2 enabled
2. **rclone** installed for uploads
3. **ffmpeg** installed for video processing

### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → R2
2. Click "Create Bucket"
3. Name: `fitness-pro-videos`
4. Region: Automatic
5. Public Access: **Disabled** (use Workers for auth)

### Step 2: Get R2 Credentials

1. In R2 dashboard → "Manage R2 API Tokens"
2. Create API Token with:
   - Permissions: Object Read & Write
   - TTL: Forever
   - Scope: Apply to specific buckets only → `fitness-pro-videos`
3. Save credentials:
   - **Access Key ID**: `<your-access-key>`
   - **Secret Access Key**: `<your-secret-key>`
   - **Account ID**: Found in R2 overview

### Step 3: Configure rclone

```bash
# Install rclone
# macOS: brew install rclone
# Ubuntu: sudo apt install rclone
# Windows: winget install Rclone.Rclone

# Configure R2 remote
rclone config create r2 s3 \
  provider=Cloudflare \
  access_key_id=<YOUR_ACCESS_KEY_ID> \
  secret_access_key=<YOUR_SECRET_ACCESS_KEY> \
  endpoint=https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com
```

### Step 4: Upload Videos

```bash
# Single file
rclone copy videos/exercises/flexao.mp4 r2:fitness-pro-videos/exercises/

# All videos
rclone sync videos/exercises/ r2:fitness-pro-videos/exercises/

# Verify uploads
rclone ls r2:fitness-pro-videos/exercises/
```

---

## Video Processing Workflow

### Step 1: Get Source Videos

**Option A: Free Stock Videos** (Recommended for MVP)
- [Pexels Fitness](https://www.pexels.com/search/videos/exercise/)
- [Mixkit Workout](https://mixkit.co/free-stock-video/workout/)
- [Videvo Exercise](https://www.videvo.net/search/exercise/)

**Option B: Record Custom Videos**
- Hire personal trainer (R$150-300/video)
- 30 exercises × R$200 = **R$6,000** total

### Step 2: Process Videos

Use the automated script:

```bash
# Make script executable (first time only)
chmod +x scripts/process-videos.sh

# Process a video
./scripts/process-videos.sh path/to/input.mp4 flexao

# Output:
# - videos/exercises/flexao.mp4 (optimized 720p)
# - videos/exercises/flexao-thumb.jpg (thumbnail)
```

**What the script does**:
- ✅ Converts to 720p (1280x720)
- ✅ H.264 codec for universal compatibility
- ✅ Optimizes for streaming (faststart flag)
- ✅ Generates thumbnail from middle frame
- ✅ Maintains aspect ratio with padding

### Step 3: Upload to R2

```bash
cd videos/exercises

# Upload video
rclone copy flexao.mp4 r2:fitness-pro-videos/exercises/

# Upload thumbnail
rclone copy flexao-thumb.jpg r2:fitness-pro-videos/exercises/

# Verify
rclone ls r2:fitness-pro-videos/exercises/ | grep flexao
```

### Step 4: Update Database

```bash
# Update the video URL mappings
cd ../..
pnpm tsx scripts/update-video-urls.ts
```

This will populate the `videoUrl` and `thumbnailUrl` fields in the database.

---

## Video Specifications

### Target Specs (Post-Processing)

```yaml
Format: MP4 (H.264)
Resolution: 1280x720 (720p)
Frame Rate: 30fps
Bitrate: 1.5-2 Mbps (variable)
Audio: AAC, 128 kbps stereo
Duration: 15-45 seconds
File Size: 3-8 MB per video
Aspect Ratio: 16:9
```

### Thumbnail Specs

```yaml
Format: JPEG
Resolution: 640x360
Quality: High (q:v 2)
File Size: ~50-100 KB
Aspect Ratio: 16:9
```

### Why These Specs?

- **720p**: Sharp enough to see form, half the size of 1080p
- **H.264**: Universal browser support, good compression
- **30fps**: Smooth motion, smaller than 60fps
- **Short duration**: 15-45s focuses on key movements
- **Small file size**: Fast loading on 4G/5G mobile

---

## Cost Estimation

### Cloudflare R2 Costs

**Free Tier** (generous):
- Storage: 10 GB/month
- Class A requests: 1M/month (writes)
- Class B requests: 10M/month (reads)
- Egress: **$0** (no bandwidth charges!)

**Fitness Pro Usage**:
- 30 videos × 5 MB = **150 MB storage** ✅ Free
- ~50k video views/month = **50k requests** ✅ Free
- Bandwidth: **Unlimited** ✅ Free

**Monthly cost**: **$0.00** 🎉

Compared to AWS S3:
- S3 storage: ~$0.35/month
- S3 egress: **~$9.00/month** (100GB at $0.09/GB)
- **Cloudflare R2 saves $9/month** thanks to zero egress fees

---

## Priority Exercise List (MVP)

Upload these **10 videos first** for Sprint 2:

### Upper Body
1. ✅ `flexao` - Flexão de Braço
2. ✅ `supino-reto` - Supino Reto
3. ✅ `remada-curvada` - Remada Curvada
4. ✅ `desenvolvimento` - Desenvolvimento
5. ✅ `rosca-direta` - Rosca Direta
6. ✅ `triceps-pulley` - Tríceps Pulley

### Lower Body
7. ✅ `agachamento` - Agachamento Livre
8. ✅ `afundo` - Afundo
9. ✅ `leg-press` - Leg Press

### Core
10. ✅ `prancha` - Prancha Abdominal

**Post-MVP**: Add remaining 20 exercises incrementally.

---

## Troubleshooting

### "rclone: command not found"

Install rclone:
```bash
# macOS
brew install rclone

# Ubuntu/Debian
sudo apt install rclone

# Windows
winget install Rclone.Rclone
```

### "ffmpeg: command not found"

Install ffmpeg:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Videos not showing in app

1. Check database was updated:
   ```sql
   SELECT slug, video_url, thumbnail_url
   FROM exercises
   WHERE slug = 'flexao';
   ```

2. Verify R2 upload:
   ```bash
   rclone ls r2:fitness-pro-videos/exercises/
   ```

3. Test API endpoint (once Worker is deployed):
   ```bash
   curl https://api.fitness-pro.com/api/exercises/flexao/video
   ```

### Large file sizes

If videos are >10MB after processing:
- Increase CRF value (23 → 26 for smaller files)
- Reduce bitrate (-b:v 1M)
- Trim duration to 30s max

---

## Future Enhancements

### Phase 2 (Post-Sprint 2)
- [ ] Add all 30 exercise videos
- [ ] Multiple camera angles
- [ ] Slow-motion replays
- [ ] Picture-in-picture common mistakes

### Phase 3 (Advanced)
- [ ] Adaptive bitrate streaming (HLS)
- [ ] Multiple quality levels (480p/720p/1080p)
- [ ] CDN analytics (most viewed exercises)
- [ ] User-submitted form check videos

---

## References

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [rclone with R2](https://rclone.org/s3/#cloudflare-r2)
- [ffmpeg Documentation](https://ffmpeg.org/ffmpeg.html)
- [Video Optimization Guide](https://www.smashingmagazine.com/2021/02/optimizing-video-size-quality/)

---

**Last Updated**: January 4, 2026
**Status**: Ready for video uploads
