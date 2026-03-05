import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getSessionsByPlayer, getSessionById } from './sessionHandler';
import type { TrainingSession } from '../types';

vi.mock('../repositories/sessionRepository');
import { sessionRepository } from '../repositories/sessionRepository';

const mockSession: TrainingSession = {
  id: '008bfbdd-7914-4488-bf3a-915d998119f1',
  playerId: '47cb55dd-134d-459b-8892-bbba4f512399',
  trainerName: 'Trainer Lisa',
  startTime: '2025-12-30T11:00:00Z',
  endTime: '2025-12-30T12:00:00Z',
  numberOfBalls: 153,
  bestStreak: 42,
  numberOfGoals: 60,
  score: 73.4,
  avgSpeedOfPlay: 3.68,
  numberOfExercises: 8,
};

const mockRes = () => {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  vi.mocked(res.status).mockReturnValue(res);
  return res;
};

beforeEach(() => vi.clearAllMocks());

describe('getSessionsByPlayer', () => {
  it('returns 400 when playerId query param is missing', async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();

    await getSessionsByPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'playerId query param is required',
    });
  });

  it('returns 200 with sessions array when playerId is valid', async () => {
    vi.mocked(sessionRepository.findByPlayerId).mockReturnValue([mockSession]);
    const req = { query: { playerId: mockSession.playerId } } as unknown as Request;
    const res = mockRes();

    await getSessionsByPlayer(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockSession] });
  });

  it('returns 200 with empty array when player has no sessions', async () => {
    vi.mocked(sessionRepository.findByPlayerId).mockReturnValue([]);
    const req = { query: { playerId: 'no-sessions-player' } } as unknown as Request;
    const res = mockRes();

    await getSessionsByPlayer(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
  });
});

describe('getSessionById', () => {
  it('returns 404 when session is not found', async () => {
    vi.mocked(sessionRepository.findById).mockReturnValue(undefined);
    const req = { params: { id: 'non-existent' } } as unknown as Request;
    const res = mockRes();

    await getSessionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Session not found' });
  });

  it('returns 200 with session data when found', async () => {
    vi.mocked(sessionRepository.findById).mockReturnValue(mockSession);
    const req = { params: { id: mockSession.id } } as unknown as Request;
    const res = mockRes();

    await getSessionById(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockSession });
  });
});
