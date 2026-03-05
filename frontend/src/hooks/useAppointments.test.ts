import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppointments } from './useAppointments';
import * as appointmentService from '../services/appointmentService';
import type { Appointment } from '../types';
import { createPlayerWrapper } from '../test/playerWrapper';

const mockAppointment: Appointment = {
  id: 'appt-1',
  playerId: 'player-1',
  trainerName: 'Coach Lee',
  startTime: '2024-04-10T14:00:00Z',
  endTime: '2024-04-10T15:00:00Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useAppointments', () => {
  it('fetches appointments using the playerId from context profile', async () => {
    const spy = vi
      .spyOn(appointmentService, 'getAppointmentsByPlayer')
      .mockResolvedValue([mockAppointment]);

    const { result } = renderHook(() => useAppointments(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-1' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledWith('player-1');
    expect(result.current.appointments).toEqual([mockAppointment]);
    expect(result.current.error).toBeNull();
  });

  it('returns empty array when player has no appointments', async () => {
    vi.spyOn(appointmentService, 'getAppointmentsByPlayer').mockResolvedValue([]);

    const { result } = renderHook(() => useAppointments(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-1' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.appointments).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.spyOn(appointmentService, 'getAppointmentsByPlayer').mockRejectedValue(
      new Error('Server error'),
    );

    const { result } = renderHook(() => useAppointments(), {
      wrapper: createPlayerWrapper({ email: null, profileId: 'player-1' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Server error');
    expect(result.current.appointments).toEqual([]);
  });

  it('does not fetch when profile is null', () => {
    const spy = vi.spyOn(appointmentService, 'getAppointmentsByPlayer');

    renderHook(() => useAppointments(), {
      wrapper: createPlayerWrapper({ email: null, profileId: null }),
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
