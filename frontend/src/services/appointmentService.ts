import type { Appointment } from '../types';
import { apiFetch } from './api';

/**
 * Fetch all upcoming appointments for a player.
 * Returns an empty array if the player has no scheduled appointments.
 */
export async function getAppointmentsByPlayer(playerId: string): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/api/appointments?playerId=${encodeURIComponent(playerId)}`);
}
