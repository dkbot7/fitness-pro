import { Context, Next } from 'hono';
import { createMiddleware } from 'hono/factory';

interface Env {
  CLERK_SECRET_KEY: string;
}

/**
 * Clerk JWT Authentication Middleware
 * Validates Clerk session tokens and extracts user information
 */
export const clerkAuth = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  try {
    // Get Authorization header
    const authHeader = c.req.header('Authorization');
    console.log('[AUTH] Authorization header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH] Invalid or missing Bearer token');
      return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log('[AUTH] Token extracted, length:', token?.length || 0);

    if (!token) {
      console.log('[AUTH] Empty token after extraction');
      return c.json({ error: 'Missing token' }, 401);
    }

    // Validate token using Clerk's Backend API
    // In production, you should use @clerk/backend package
    // For now, we'll decode the JWT to extract the user ID
    const decoded = parseJwt(token);
    console.log('[AUTH] Decoded token:', decoded ? 'Success' : 'Failed');
    console.log('[AUTH] User ID (sub):', decoded?.sub);

    if (!decoded || !decoded.sub) {
      console.log('[AUTH] Invalid token or missing sub claim');
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Set user ID in context
    c.set('userId', decoded.sub);
    c.set('user', decoded);

    console.log('[AUTH] Authentication successful for user:', decoded.sub);
    await next();
  } catch (error: any) {
    console.error('[AUTH] Auth middleware error:', error);
    return c.json({ error: 'Unauthorized', details: error.message }, 401);
  }
});

/**
 * Simple JWT parser (without signature verification)
 * WARNING: This is NOT secure for production. Use @clerk/backend instead.
 */
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
