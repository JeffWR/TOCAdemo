import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getAppointmentsByPlayer } from './appointmentHandler';
import type { Appointment } from '../types';

vi.mock('../repositories/appointmentRepository');
import { appointmentRepository } from '../repositories/appointmentRepository';

const mockAppointment: Appointment = {
  id: 'd9332a5a-aa28-46c6-a370-26413ba0ba1c',
  playerId: '47cb55dd-134d-459b-8892-bbba4f512399',
  trainerName: 'Trainer Sarah',
  startTime: '2026-01-21T15:00:00Z',
  endTime: '2026-01-21T17:00:00Z',
};

const mockRes = () => {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  vi.mocked(res.status).mockReturnValue(res);
  return res;
};

beforeEach(() => vi.clearAllMocks());

describe('getAppointmentsByPlayer', () => {
  it('returns 400 when playerId query param is missing', async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();

    await getAppointmentsByPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'playerId query param is required' });
  });

  it('returns 200 with appointments array when playerId is valid', async () => {
    vi.mocked(appointmentRepository.findByPlayerId).mockReturnValue([mockAppointment]);
    const req = { query: { playerId: mockAppointment.playerId } } as unknown as Request;
    const res = mockRes();

    await getAppointmentsByPlayer(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockAppointment] });
  });

  it('returns 200 with empty array when player has no appointments', async () => {
    vi.mocked(appointmentRepository.findByPlayerId).mockReturnValue([]);
    const req = { query: { playerId: 'no-appts-player' } } as unknown as Request;
    const res = mockRes();

    await getAppointmentsByPlayer(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
  });
});
