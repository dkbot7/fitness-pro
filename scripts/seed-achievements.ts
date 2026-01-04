/**
 * Script to seed achievements/badges into the database
 * Based on research: gamification boosts engagement by up to 150%
 *
 * Sources:
 * - https://www.trophy.so/blog/fitness-gamification-examples
 * - https://trophy.so/blog/streaks-feature-gamification-examples
 *
 * Run with: tsx scripts/seed-achievements.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { achievements } from '../packages/database/src/schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../packages/database/.env') });

interface Achievement {
  slug: string;
  namePt: string;
  descriptionPt: string;
  iconName: string; // Lucide icon name
  category: 'streak' | 'milestone' | 'special';
  requirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENTS: Achievement[] = [
  // === STREAK ACHIEVEMENTS (Consecutive days) ===
  {
    slug: 'streak-3',
    namePt: 'Aquecendo',
    descriptionPt: 'Complete treinos por 3 dias seguidos',
    iconName: 'Flame',
    category: 'streak',
    requirement: 3,
    rarity: 'common',
  },
  {
    slug: 'streak-7',
    namePt: 'Semana Completa',
    descriptionPt: 'Complete treinos por 7 dias seguidos',
    iconName: 'Flame',
    category: 'streak',
    requirement: 7,
    rarity: 'rare',
  },
  {
    slug: 'streak-14',
    namePt: 'Fortalecendo',
    descriptionPt: 'Complete treinos por 14 dias seguidos',
    iconName: 'Zap',
    category: 'streak',
    requirement: 14,
    rarity: 'rare',
  },
  {
    slug: 'streak-30',
    namePt: 'Mês de Ferro',
    descriptionPt: 'Complete treinos por 30 dias seguidos',
    iconName: 'Award',
    category: 'streak',
    requirement: 30,
    rarity: 'epic',
  },
  {
    slug: 'streak-60',
    namePt: 'Imparável',
    descriptionPt: 'Complete treinos por 60 dias seguidos',
    iconName: 'Trophy',
    category: 'streak',
    requirement: 60,
    rarity: 'epic',
  },
  {
    slug: 'streak-100',
    namePt: 'Lenda Viva',
    descriptionPt: 'Complete treinos por 100 dias seguidos',
    iconName: 'Crown',
    category: 'streak',
    requirement: 100,
    rarity: 'legendary',
  },

  // === MILESTONE ACHIEVEMENTS (Total workouts) ===
  {
    slug: 'workouts-1',
    namePt: 'Primeiro Passo',
    descriptionPt: 'Complete seu primeiro treino',
    iconName: 'CheckCircle',
    category: 'milestone',
    requirement: 1,
    rarity: 'common',
  },
  {
    slug: 'workouts-5',
    namePt: 'Iniciante Dedicado',
    descriptionPt: 'Complete 5 treinos',
    iconName: 'Star',
    category: 'milestone',
    requirement: 5,
    rarity: 'common',
  },
  {
    slug: 'workouts-10',
    namePt: 'Em Ritmo',
    descriptionPt: 'Complete 10 treinos',
    iconName: 'Star',
    category: 'milestone',
    requirement: 10,
    rarity: 'common',
  },
  {
    slug: 'workouts-25',
    namePt: 'Constância',
    descriptionPt: 'Complete 25 treinos',
    iconName: 'Target',
    category: 'milestone',
    requirement: 25,
    rarity: 'rare',
  },
  {
    slug: 'workouts-50',
    namePt: 'Meio Século',
    descriptionPt: 'Complete 50 treinos',
    iconName: 'Medal',
    category: 'milestone',
    requirement: 50,
    rarity: 'rare',
  },
  {
    slug: 'workouts-100',
    namePt: 'Centurião',
    descriptionPt: 'Complete 100 treinos',
    iconName: 'Trophy',
    category: 'milestone',
    requirement: 100,
    rarity: 'epic',
  },
  {
    slug: 'workouts-250',
    namePt: 'Elite',
    descriptionPt: 'Complete 250 treinos',
    iconName: 'Award',
    category: 'milestone',
    requirement: 250,
    rarity: 'epic',
  },
  {
    slug: 'workouts-500',
    namePt: 'Mestre do Fitness',
    descriptionPt: 'Complete 500 treinos',
    iconName: 'Crown',
    category: 'milestone',
    requirement: 500,
    rarity: 'legendary',
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    slug: 'week-1-complete',
    namePt: 'Primeira Semana',
    descriptionPt: 'Complete todos os treinos da Semana 1',
    iconName: 'Calendar',
    category: 'special',
    requirement: 1,
    rarity: 'common',
  },
  {
    slug: 'week-4-complete',
    namePt: 'Primeiro Mês',
    descriptionPt: 'Complete 4 semanas de treino',
    iconName: 'CalendarCheck',
    category: 'special',
    requirement: 4,
    rarity: 'rare',
  },
  {
    slug: 'week-12-complete',
    namePt: 'Transformação',
    descriptionPt: 'Complete 12 semanas de treino',
    iconName: 'Sparkles',
    category: 'special',
    requirement: 12,
    rarity: 'epic',
  },
  {
    slug: 'early-bird',
    namePt: 'Madrugador',
    descriptionPt: 'Complete 10 treinos antes das 7h',
    iconName: 'Sunrise',
    category: 'special',
    requirement: 10,
    rarity: 'rare',
  },
  {
    slug: 'night-owl',
    namePt: 'Coruja Noturna',
    descriptionPt: 'Complete 10 treinos depois das 21h',
    iconName: 'Moon',
    category: 'special',
    requirement: 10,
    rarity: 'rare',
  },
  {
    slug: 'perfect-week',
    namePt: 'Semana Perfeita',
    descriptionPt: 'Complete 100% dos treinos de uma semana',
    iconName: 'BadgeCheck',
    category: 'special',
    requirement: 1,
    rarity: 'epic',
  },
];

async function seedAchievements() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  console.log('🏆 Seeding achievements/badges...\n');
  console.log(`📊 Total achievements: ${ACHIEVEMENTS.length}`);
  console.log(`   Common: ${ACHIEVEMENTS.filter((a) => a.rarity === 'common').length}`);
  console.log(`   Rare: ${ACHIEVEMENTS.filter((a) => a.rarity === 'rare').length}`);
  console.log(`   Epic: ${ACHIEVEMENTS.filter((a) => a.rarity === 'epic').length}`);
  console.log(`   Legendary: ${ACHIEVEMENTS.filter((a) => a.rarity === 'legendary').length}\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  let inserted = 0;
  let skipped = 0;

  for (const achievement of ACHIEVEMENTS) {
    try {
      await db.insert(achievements).values({
        slug: achievement.slug,
        namePt: achievement.namePt,
        descriptionPt: achievement.descriptionPt,
        iconName: achievement.iconName,
        category: achievement.category,
        requirement: achievement.requirement,
        rarity: achievement.rarity,
        isActive: true,
      });

      console.log(`  ✓ ${achievement.namePt} (${achievement.rarity})`);
      inserted++;
    } catch (error: any) {
      if (error?.code === '23505') {
        // Duplicate key - achievement already exists
        console.log(`  ⊘ ${achievement.namePt} (already exists)`);
        skipped++;
      } else {
        console.error(`  ✗ Error seeding ${achievement.namePt}:`, error.message);
        skipped++;
      }
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\n💡 Achievement system ready!`);
  console.log(`   Research shows gamification boosts engagement by 150%`);
}

seedAchievements()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
