import { createMiddleware } from 'hono/factory';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { logger } from '../utils/logger';
import type { AppContext } from '../types/hono';

// Cache JWKS for performance
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Clerk JWT Authentication Middleware
 * Validates Clerk session tokens with proper signature verification
 */
export const clerkAuth = createMiddleware<AppContext>(async (c, next) => {
  try {
    // Get Authorization header
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return c.json({ error: 'Missing token' }, 401);
    }

    // Get Clerk secret key
    const secretKey = c.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      logger.error('CLERK_SECRET_KEY not configured');
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // Extract the publishable key from secret key format (sk_test_... or sk_live_...)
    // Clerk JWKS URL format: https://[domain].clerk.accounts.dev/.well-known/jwks.json
    const clerkDomain = await getClerkDomain(token);

    if (!clerkDomain) {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    // Initialize JWKS if not cached
    if (!jwksCache) {
      const jwksUrl = `https://${clerkDomain}/.well-known/jwks.json`;
      jwksCache = createRemoteJWKSet(new URL(jwksUrl));
    }

    // Verify JWT with signature validation
    const { payload } = await jwtVerify(token, jwksCache, {
      algorithms: ['RS256'],
    });

    // Validate required claims
    if (!payload.sub) {
      return c.json({ error: 'Invalid token: missing user ID' }, 401);
    }

    // Set user ID and full payload in context
    c.set('userId', payload.sub);
    c.set('user', payload);

    logger.debug('Authentication successful', { userId: payload.sub });

    await next();
  } catch (error: any) {
    // Handle specific JWT errors
    if (error.code === 'ERR_JWT_EXPIRED') {
      logger.warn('Token expired', { error: error.message });
      return c.json({ error: 'Token expired' }, 401);
    }
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      logger.warn('Invalid token signature', { error: error.message });
      return c.json({ error: 'Invalid token signature' }, 401);
    }

    logger.error('Authentication error', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

/**
 * Extract Clerk domain from JWT token (from 'iss' claim)
 */
async function getClerkDomain(token: string): Promise<string | null> {
  try {
    // Decode JWT without verification to get issuer
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    // Extract domain from issuer (e.g., "https://clerk.example.com" -> "clerk.example.com")
    const issuer = payload.iss as string;
    if (!issuer) return null;

    const url = new URL(issuer);
    return url.hostname;
  } catch (error) {
    return null;
  }
}
