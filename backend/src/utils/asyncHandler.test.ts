import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import { asyncHandler } from './asyncHandler';

// Minimal Express mock objects — we only need the shape, not real Express
const req = {} as Request;
const res = {} as Response;

describe('asyncHandler', () => {
  it('calls the handler and does not call next when the handler resolves', async () => {
    const next = vi.fn();
    const handler = vi.fn().mockResolvedValue(undefined);

    await asyncHandler(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with the error when the handler rejects', async () => {
    const next = vi.fn();
    const error = new Error('something went wrong');
    const handler = vi.fn().mockRejectedValue(error);

    await asyncHandler(handler)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
