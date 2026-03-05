import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from './useSession';
import * as sessionService from '../services/sessionService';
import type { TrainingSession } from '../types';

// useSession takes id as a plain argument — it does not use PlayerContext,
// so no wrapper is needed.

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

describe('useSession', () => {
  it('fetches the session with the given id', async () => {
    const spy = vi.spyOn(sessionService, 'getSessionById').mockResolvedValue(mockSession);

    const { result } = renderHook(() => useSession('sess-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledWith('sess-1');
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.spyOn(sessionService, 'getSessionById').mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useSession('missing'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Not found');
    expect(result.current.session).toBeNull();
  });

  it('does not fetch and starts with loading: false when id is empty', () => {
    const spy = vi.spyOn(sessionService, 'getSessionById');

    const { result } = renderHook(() => useSession(''));

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
