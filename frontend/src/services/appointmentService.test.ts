import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';
import { getAppointmentsByPlayer } from './appointmentService';
import type { Appointment } from '../types';

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

describe('getAppointmentsByPlayer', () => {
  it('calls the correct endpoint and returns appointments array', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue([mockAppointment]);

    const result = await getAppointmentsByPlayer('player-1');

    expect(spy).toHaveBeenCalledWith('/api/appointments?playerId=player-1');
    expect(result).toEqual([mockAppointment]);
  });

  it('returns an empty array when the player has no appointments', async () => {
    vi.spyOn(api, 'apiFetch').mockResolvedValue([]);

    const result = await getAppointmentsByPlayer('player-no-appts');

    expect(result).toEqual([]);
  });

  it('propagates errors from apiFetch', async () => {
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new api.ApiError('Bad request'));

    await expect(getAppointmentsByPlayer('bad')).rejects.toBeInstanceOf(api.ApiError);
  });
});
