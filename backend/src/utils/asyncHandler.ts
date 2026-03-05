import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Express does not catch errors thrown inside async handlers automatically.
// This wrapper forwards any rejection to next(err), reaching the global error middleware.
export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
