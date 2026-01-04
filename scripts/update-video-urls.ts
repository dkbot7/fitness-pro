/**
 * Script to update video and thumbnail URLs in the database
 * Run with: tsx scripts/update-video-urls.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { exercises } from '../packages/database/src/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from packages/database/.env
dotenv.config({ path: path.resolve(__dirname, '../packages/database/.env') });

// Base URL for serving videos (update this when R2 is configured)
const VIDEO_BASE_URL = process.env.VIDEO_BASE_URL || 'https://api.fitness-pro.com/api/exercises';

// Map of exercises that have videos uploaded to R2
// Add exercises here as you upload their videos
const EXERCISES_WITH_VIDEOS: Record<string, boolean> = {
  // MVP - 10 priority videos (Sprint 2)
  'flexao': true,
  'agachamento': true,
  'prancha': true,
  'afundo': true,
  'supino-reto': true,
  'remada-curvada': true,
  'desenvolvimento': true,
  'rosca-direta': true,
  'triceps-pulley': true,
  'leg-press': true,

  // Phase 2 - Remaining 20 videos (post-Sprint 2)
  // 'burpee': true,
  // 'mountain-climber': true,
  // 'triceps-banco': true,
  // ... add more as you upload
};

async function updateVideoUrls() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  console.log('🎥 Updating video URLs in database...\n');
  console.log(`📍 Base URL: ${VIDEO_BASE_URL}\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  let updated = 0;
  let skipped = 0;

  for (const [slug, hasVideo] of Object.entries(EXERCISES_WITH_VIDEOS)) {
    if (hasVideo) {
      try {
        const result = await db
          .update(exercises)
          .set({
            videoUrl: `${VIDEO_BASE_URL}/${slug}/video`,
            thumbnailUrl: `${VIDEO_BASE_URL}/${slug}/thumbnail`,
          })
          .where(eq(exercises.slug, slug))
          .returning({ slug: exercises.slug });

        if (result.length > 0) {
          console.log(`  ✓ Updated: ${slug}`);
          console.log(`    Video: ${VIDEO_BASE_URL}/${slug}/video`);
          console.log(`    Thumb: ${VIDEO_BASE_URL}/${slug}/thumbnail`);
          updated++;
        } else {
          console.log(`  ⚠ Not found in DB: ${slug}`);
          skipped++;
        }
      } catch (error: any) {
        console.error(`  ✗ Error updating ${slug}:`, error.message);
        skipped++;
      }
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\n💡 Videos will now appear in the ExerciseCard component`);
}

updateVideoUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
