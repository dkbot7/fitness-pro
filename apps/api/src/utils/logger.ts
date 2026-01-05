/**
 * Structured Logging Utility for Cloudflare Workers
 * Provides consistent, searchable logs with context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel;
  private service: string;

  constructor(service: string = 'fitness-pro-api', minLevel: LogLevel = LogLevel.INFO) {
    this.service = service;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatLog(level: string, message: string, context?: LogContext, error?: Error): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        service: this.service,
        ...context,
      },
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return JSON.stringify(entry);
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.log(this.formatLog('DEBUG', message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.log(this.formatLog('INFO', message, context));
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatLog('WARN', message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(this.formatLog('ERROR', message, context, error));
  }

  // Request logging helpers
  logRequest(method: string, path: string, userId?: string, duration?: number): void {
    this.info('HTTP Request', {
      method,
      path,
      userId,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  logAuth(userId: string, success: boolean, reason?: string): void {
    this.info('Authentication', {
      userId,
      success,
      reason,
    });
  }

  logDatabase(operation: string, table: string, duration?: number, error?: Error): void {
    if (error) {
      this.error(`Database ${operation} failed`, error, { table, duration });
    } else {
      this.debug(`Database ${operation}`, { table, duration });
    }
  }

  logCache(operation: 'HIT' | 'MISS' | 'SET', key: string, ttl?: number): void {
    this.debug(`Cache ${operation}`, { key, ttl });
  }
}

// Global logger instance
export const logger = new Logger('fitness-pro-api', LogLevel.INFO);

// Set log level based on environment
export function configureLogger(env: string): void {
  const level = env === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  logger['minLevel'] = level;
}

/**
 * Request logging middleware
 */
export function requestLogger() {
  return async (c: any, next: any) => {
    const start = Date.now();
    const method = c.req.method;
    const path = new URL(c.req.url).pathname;
    const userId = c.get('userId');

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    logger.info('Request completed', {
      method,
      path,
      status,
      duration: `${duration}ms`,
      userId,
    });
  };
}
