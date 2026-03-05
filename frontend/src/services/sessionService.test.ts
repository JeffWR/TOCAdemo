import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';
import { getSessionsByPlayer, getSessionById } from './sessionService';
import type { TrainingSession } from '../types';

const mockSession: TrainingSession = {
  id: 'sess-1',
  playerId: 'player-1',
  trainerName: 'Coach Lee',
  startTime: '2024-03-01T10:00:00Z',
  endTime: '2024-03-01T11:00:00Z',
  numberOfBalls: 200,
  bestStreak: 12,
  numberOfGoals: 45,
  score: 88,
  avgSpeedOfPlay: 3.4,
  numberOfExercises: 6,
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('getSessionsByPlayer', () => {
  it('calls the correct endpoint with playerId and returns sessions array', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue([mockSession]);

    const result = await getSessionsByPlayer('player-1');

    expect(spy).toHaveBeenCalledWith('/api/sessions?playerId=player-1'); // encodeURIComponent('player-1') === 'player-1'
    expect(result).toEqual([mockSession]);
  });

  it('returns an empty array when the player has no sessions', async () => {
    vi.spyOn(api, 'apiFetch').mockResolvedValue([]);

    const result = await getSessionsByPlayer('player-no-sessions');

    expect(result).toEqual([]);
  });

  it('propagates errors from apiFetch', async () => {
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new api.ApiError('Bad request'));

    await expect(getSessionsByPlayer('bad')).rejects.toBeInstanceOf(api.ApiError);
  });
});

describe('getSessionById', () => {
  it('calls the correct endpoint and returns the session', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue(mockSession);

    const result = await getSessionById('sess-1');

    expect(spy).toHaveBeenCalledWith('/api/sessions/sess-1');
    expect(result).toEqual(mockSession);
  });

  it('propagates errors from apiFetch', async () => {
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new api.ApiError('Not found'));

    await expect(getSessionById('missing')).rejects.toBeInstanceOf(api.ApiError);
  });
});
