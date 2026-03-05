import type { Request, Response } from 'express';
import { appointmentRepository } from '../repositories/appointmentRepository';

export async function getAppointmentsByPlayer(req: Request, res: Response): Promise<void> {
  const { playerId } = req.query;

  if (typeof playerId !== 'string' || playerId.trim() === '') {
    res.status(400).json({ success: false, error: 'playerId query param is required' });
    return;
  }

  const appointments = appointmentRepository.findByPlayerId(playerId);
  res.json({ success: true, data: appointments });
}
