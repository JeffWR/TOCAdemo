import type { Request, Response, NextFunction } from 'express';

// Must have 4 parameters — Express identifies error middleware by arity.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
}
