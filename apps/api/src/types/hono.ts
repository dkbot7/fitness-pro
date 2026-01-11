import type { JWTPayload } from 'jose';
import type { SubmitFeedbackInput } from '../validation/schemas';

/**
 * Environment bindings for Cloudflare Workers
 */
export interface Env {
  DB: D1Database;
  VIDEOS: R2Bucket; // R2 Storage for exercise videos
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY?: string;
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
  CRON_SECRET?: string; // Secret for cron authentication
  VAPID_PUBLIC_KEY?: string; // Web Push VAPID public key
  VAPID_PRIVATE_KEY?: string; // Web Push VAPID private key
}

/**
 * Extended JWT Payload with Clerk-specific claims
 */
export interface ClerkJWTPayload extends JWTPayload {
  email?: string;
  email_address?: string;
  name?: string;
  full_name?: string;
}

/**
 * Custom variables stored in Hono context
 */
export interface HonoVariables {
  userId: string;
  user: ClerkJWTPayload;
  validatedBody?: SubmitFeedbackInput | any;
}

/**
 * Type helper for Hono Context with custom bindings and variables
 */
export type AppContext = {
  Bindings: Env;
  Variables: HonoVariables;
};
