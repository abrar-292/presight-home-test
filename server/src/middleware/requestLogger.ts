import { Request, Response, NextFunction } from 'express';

/**
 * Lightweight structured request logger.
 * Logs: [METHOD] /path → statusCode (Xms)
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' // red
      : res.statusCode >= 400 ? '\x1b[33m' // yellow
      : '\x1b[32m'; // green
    const reset = '\x1b[0m';

    console.log(
      `${statusColor}[${req.method}]${reset} ${req.originalUrl} → ${statusColor}${res.statusCode}${reset} (${duration}ms)`,
    );
  });

  next();
}
