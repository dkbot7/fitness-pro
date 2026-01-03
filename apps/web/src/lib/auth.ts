import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get the current authenticated user's ID
 * Throws an error if the user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}

/**
 * Get the current authenticated user's full profile
 * Returns null if the user is not authenticated
 */
export async function getCurrentUser() {
  return await currentUser();
}

/**
 * Get the user's Clerk ID (safe to use in client components)
 * Returns null if not authenticated
 */
export async function getUserId() {
  const { userId } = await auth();
  return userId;
}
