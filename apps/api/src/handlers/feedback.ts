import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { workoutFeedback, workouts } from '@fitness-pro/database';
import { eq, and } from 'drizzle-orm';
import type { SubmitFeedbackInput } from '../validation/schemas';

interface Env {
  DB: D1Database;
}

/**
 * POST /api/feedback
 * Save workout feedback (difficulty rating, duration, notes)
 */
export async function submitFeedback(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Get validated request body
    const body = c.get('validatedBody') as SubmitFeedbackInput;
    const { workoutId, difficultyRating, durationMinutes, notes } = body;

    // 3. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 4. Verify workout belongs to user and is completed
    const workoutRecords = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.id, workoutId),
          eq(workouts.userId, userId)
        )
      )
      .limit(1);

    if (workoutRecords.length === 0) {
      return c.json({ error: 'Workout not found' }, 404);
    }

    const workout = workoutRecords[0];

    if (workout.status !== 'completed') {
      return c.json(
        { error: 'Workout must be completed before submitting feedback' },
        400
      );
    }

    // 5. Check if feedback already exists
    const existingFeedback = await db
      .select()
      .from(workoutFeedback)
      .where(eq(workoutFeedback.workoutId, workoutId))
      .limit(1);

    if (existingFeedback.length > 0) {
      // Update existing feedback
      const [updated] = await db
        .update(workoutFeedback)
        .set({
          difficultyRating,
          durationMinutes: durationMinutes || null,
          notes: notes || null,
        })
        .where(eq(workoutFeedback.workoutId, workoutId))
        .returning();

      return c.json({
        success: true,
        message: 'Feedback atualizado com sucesso!',
        feedback: updated,
      });
    }

    // 6. Insert new feedback
    const [feedback] = await db
      .insert(workoutFeedback)
      .values({
        workoutId,
        userId,
        difficultyRating,
        durationMinutes: durationMinutes || null,
        notes: notes || null,
      })
      .returning();

    return c.json({
      success: true,
      message: 'Obrigado pelo feedback! Usaremos isso para ajustar seu plano.',
      feedback,
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return c.json(
      {
        error: 'Failed to save feedback',
        details: error.message,
      },
      500
    );
  }
}
