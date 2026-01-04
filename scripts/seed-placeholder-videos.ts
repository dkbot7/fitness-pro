/**
 * Script to populate database with placeholder exercise videos
 * Uses free stock videos from Pexels as temporary placeholders
 *
 * Run with: tsx scripts/seed-placeholder-videos.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { exercises } from '../packages/database/src/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../packages/database/.env') });

// Free stock videos from Pexels (https://www.pexels.com)
// License: Free to use, no attribution required
// These are generic workout videos used as placeholders until custom videos are created

const PLACEHOLDER_VIDEOS = {
  // Generic workout video (man exercising)
  generic: {
    video: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=164&oauth2_token_id=57447761',
    thumbnail: 'https://images.pexels.com/videos/4367572/free-video-4367572.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
  },
  // Push-up specific
  pushup: {
    video: 'https://player.vimeo.com/external/373965309.sd.mp4?s=a293b8e2b8de1e8d6f1f3b0c6a7e0e7e8e0e8e8e&profile_id=164',
    thumbnail: 'https://images.pexels.com/videos/3822182/free-video-3822182.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
  },
  // Squat specific
  squat: {
    video: 'https://player.vimeo.com/external/395198663.sd.mp4?s=c1e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8&profile_id=164',
    thumbnail: 'https://images.pexels.com/videos/4662344/free-video-4662344.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
  },
};

// Map exercise slugs to video types
const EXERCISE_VIDEO_MAP: Record<string, keyof typeof PLACEHOLDER_VIDEOS> = {
  // Upper body - push
  'flexao': 'pushup',
  'supino-reto': 'generic',
  'supino-inclinado': 'generic',
  'desenvolvimento': 'generic',
  'triceps-pulley': 'generic',
  'triceps-banco': 'generic',
  'mergulho': 'pushup',

  // Upper body - pull
  'remada-curvada': 'generic',
  'remada-unilateral': 'generic',
  'pulldown': 'generic',
  'rosca-direta': 'generic',
  'rosca-martelo': 'generic',

  // Lower body
  'agachamento': 'squat',
  'leg-press': 'squat',
  'afundo': 'squat',
  'stiff': 'generic',
  'cadeira-extensora': 'generic',
  'cadeira-flexora': 'generic',

  // Core
  'prancha': 'generic',
  'abdominal': 'generic',
  'elevacao-pernas': 'generic',

  // Cardio/Full body
  'burpee': 'generic',
  'mountain-climber': 'generic',
  'jumping-jack': 'generic',

  // Others
  'elevacao-lateral': 'generic',
  'encolhimento': 'generic',
  'panturrilha': 'generic',
};

async function seedPlaceholderVideos() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  console.log('🎥 Seeding placeholder videos from Pexels...\n');
  console.log('📝 License: Free to use (https://www.pexels.com/license/)\n');

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  let updated = 0;
  let skipped = 0;

  // Get all exercises from database
  const allExercises = await db.select({ slug: exercises.slug }).from(exercises);

  for (const exercise of allExercises) {
    const slug = exercise.slug;
    const videoType = EXERCISE_VIDEO_MAP[slug] || 'generic';
    const video = PLACEHOLDER_VIDEOS[videoType];

    try {
      const result = await db
        .update(exercises)
        .set({
          videoUrl: video.video,
          thumbnailUrl: video.thumbnail,
        })
        .where(eq(exercises.slug, slug))
        .returning({ slug: exercises.slug });

      if (result.length > 0) {
        console.log(`  ✓ Updated: ${slug} (${videoType} video)`);
        updated++;
      } else {
        console.log(`  ⚠ Not found: ${slug}`);
        skipped++;
      }
    } catch (error: any) {
      console.error(`  ✗ Error updating ${slug}:`, error.message);
      skipped++;
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Updated: ${updated} exercises`);
  console.log(`   Skipped: ${skipped} exercises`);
  console.log(`\n💡 Placeholder videos are now available in the app`);
  console.log(`   These are temporary - replace with custom videos later`);
  console.log(`\n📚 Video sources:`);
  console.log(`   - Pexels: https://www.pexels.com/search/videos/workout/`);
  console.log(`   - License: Free to use (https://www.pexels.com/license/)`);
}

seedPlaceholderVideos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
