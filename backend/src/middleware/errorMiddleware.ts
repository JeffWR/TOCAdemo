import type { Request, Response, NextFunction } from 'express';

// Must have 4 parameters — Express identifies error middleware by arity.
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (process.env['NODE_ENV'] !== 'production') {
    // eslint-disable-next-line no-console -- server-side error logging is intentional
    console.error(err.stack);
  } else {
    // eslint-disable-next-line no-console -- log message only in production; no stack paths
    console.error(err.message);
  }
  res.status(500).json({ success: false, error: 'Internal server error' });
}
