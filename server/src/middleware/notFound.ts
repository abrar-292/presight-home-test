import { Request, Response, NextFunction } from 'express';

/**
 * Catch-all 404 handler for unmatched routes.
 * Must be registered AFTER all valid routes.
 */
export function notFound(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
}
