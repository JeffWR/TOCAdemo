import type { Request, Response } from 'express';
import { profileRepository } from '../repositories/profileRepository';

export async function getProfileByEmail(req: Request, res: Response): Promise<void> {
  const { email } = req.query;

  if (typeof email !== 'string' || email.trim() === '') {
    res.status(400).json({ success: false, error: 'email query param is required' });
    return;
  }

  const profile = profileRepository.findByEmail(email);

  if (profile === undefined) {
    res.status(404).json({ success: false, error: 'Profile not found' });
    return;
  }

  res.json({ success: true, data: profile });
}

export async function getProfileById(req: Request, res: Response): Promise<void> {
  const rawId = req.params['id'];
  // Express route params are always a string when present; @types/express@5 types them
  // as string | string[], so we guard with typeof before passing to the repository.
  if (typeof rawId !== 'string') {
    res.status(404).json({ success: false, error: 'Profile not found' });
    return;
  }

  const profile = profileRepository.findById(rawId);

  if (profile === undefined) {
    res.status(404).json({ success: false, error: 'Profile not found' });
    return;
  }

  res.json({ success: true, data: profile });
}
