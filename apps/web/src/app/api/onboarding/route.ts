import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { onboardingSchema } from '@/lib/validations/onboarding';

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = onboardingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Forward to backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
    const response = await fetch(`${apiUrl}/api/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.id,
        'X-User-Email': user.emailAddresses[0]?.emailAddress || '',
        'X-User-Name': user.firstName || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to save onboarding' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
