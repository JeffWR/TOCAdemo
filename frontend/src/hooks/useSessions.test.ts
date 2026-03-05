import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSessions } from './useSessions';
import * as sessionService from '../services/sessionService';
import type { TrainingSession } from '../types';
import { createPlayerWrapper } from '../test/playerWrapper';

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

describe('useSessions', () => {
  it('fetches sessions using the playerId from context profile', async () => {
    const spy = vi.spyOn(sessionService, 'getSessionsByPlayer').mockResolvedValue([mockSession]);

    const { result } = renderHook(() => useSessions(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-1' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledWith('player-1');
    expect(result.current.sessions).toEqual([mockSession]);
    expect(result.current.error).toBeNull();
  });

  it('returns empty array and no error when player has no sessions', async () => {
    vi.spyOn(sessionService, 'getSessionsByPlayer').mockResolvedValue([]);

    const { result } = renderHook(() => useSessions(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-no-sessions' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.sessions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.spyOn(sessionService, 'getSessionsByPlayer').mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-1' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Server error');
    expect(result.current.sessions).toEqual([]);
  });

  it('does not fetch when profile is null', () => {
    const spy = vi.spyOn(sessionService, 'getSessionsByPlayer');

    renderHook(() => useSessions(), {
      wrapper: createPlayerWrapper({ email: null, profileId: null }),
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
