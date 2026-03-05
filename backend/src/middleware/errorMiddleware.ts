import type { Request, Response, NextFunction } from 'express';

// Must have 4 parameters — Express identifies error middleware by arity.
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // eslint-disable-next-line no-console -- server-side error logging is intentional
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
}
