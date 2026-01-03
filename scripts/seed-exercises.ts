import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { exercises } from '../packages/database/src/schema';
import { EXERCISES } from '../packages/shared/src/constants/exercises';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from packages/database/.env
dotenv.config({ path: path.resolve(__dirname, '../packages/database/.env') });

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  console.log('🌱 Starting seed process...\n');

  // Connect to database
  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log('📦 Seeding 30 exercises...');

  for (const exercise of EXERCISES) {
    try {
      await db.insert(exercises).values({
        slug: exercise.slug,
        namePt: exercise.namePt,
        muscleGroups: exercise.muscleGroups,
        equipmentRequired: exercise.equipmentRequired,
        difficulty: exercise.difficulty,
        descriptionPt: exercise.descriptionPt,
        contraindications: exercise.contraindications,
        videoUrl: null, // Videos will be added in Week 5
        thumbnailUrl: null,
        isActive: true,
      });

      console.log(`  ✓ ${exercise.namePt} (${exercise.slug})`);
    } catch (error: any) {
      // Ignore duplicate key errors (slug already exists)
      if (error?.code === '23505') {
        console.log(`  ⊘ ${exercise.namePt} (already exists)`);
      } else {
        console.error(`  ✗ Error seeding ${exercise.namePt}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Seed completed! ${EXERCISES.length} exercises processed.`);
  console.log('\n📊 Summary:');
  console.log('  - Bodyweight: 10 exercises');
  console.log('  - Dumbbells: 10 exercises');
  console.log('  - Gym Equipment: 10 exercises');
  console.log('\n💡 Next step: Add exercise videos in Week 5\n');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
