import { Context, Next } from 'hono';
import { z, ZodSchema } from 'zod';

/**
 * Validation middleware factory
 * Creates middleware that validates request data against a Zod schema
 */

export function validateBody<T extends ZodSchema>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);

      // Store validated data in context for handler to use
      c.set('validatedBody', validated);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json({ error: 'Invalid request body' }, 400);
    }
  };
}

export function validateQuery<T extends ZodSchema>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validated = schema.parse(query);

      // Store validated data in context
      c.set('validatedQuery', validated);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json({ error: 'Invalid query parameters' }, 400);
    }
  };
}

export function validateParams<T extends ZodSchema>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);

      // Store validated data in context
      c.set('validatedParams', validated);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json({ error: 'Invalid path parameters' }, 400);
    }
  };
}
