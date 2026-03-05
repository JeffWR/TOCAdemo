import type { Request, Response } from 'express';
import { sessionRepository } from '../repositories/sessionRepository';

export async function getSessionsByPlayer(req: Request, res: Response): Promise<void> {
  const { playerId } = req.query;

  if (typeof playerId !== 'string' || playerId.trim() === '') {
    res.status(400).json({ success: false, error: 'playerId query param is required' });
    return;
  }

  const sessions = sessionRepository.findByPlayerId(playerId);
  res.json({ success: true, data: sessions });
}

export async function getSessionById(req: Request, res: Response): Promise<void> {
  const rawId = req.params['id'];
  // Express route params are always a string when present; @types/express@5 types them
  // as string | string[], so we guard with typeof before passing to the repository.
  if (typeof rawId !== 'string') {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  const session = sessionRepository.findById(rawId);

  if (session === undefined) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  res.json({ success: true, data: session });
}
