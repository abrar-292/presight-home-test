import { Request, Response, NextFunction } from 'express';
import config from '../config/env';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Global Express error handler.
 * Controllers call next(err) instead of writing their own try/catch response logic.
 * Must be registered LAST in the middleware chain (after routes and notFound).
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const statusCode = err.status ?? err.statusCode ?? 500;

  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}
