import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { workoutId, difficultyRating, durationMinutes, notes } = body;

    if (!workoutId || !difficultyRating) {
      return NextResponse.json(
        { error: 'Missing required fields: workoutId, difficultyRating' },
        { status: 400 }
      );
    }

    // Validate difficultyRating
    if (!['easy', 'ok', 'hard'].includes(difficultyRating)) {
      return NextResponse.json(
        { error: 'Invalid difficultyRating. Must be: easy, ok, or hard' },
        { status: 400 }
      );
    }

    // 3. Forward to backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
    const response = await fetch(`${apiUrl}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.id,
        'X-User-Email': user.emailAddresses[0]?.emailAddress || '',
      },
      body: JSON.stringify({
        workoutId,
        difficultyRating,
        durationMinutes,
        notes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to save feedback' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
