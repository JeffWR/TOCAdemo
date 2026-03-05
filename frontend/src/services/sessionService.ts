import type { TrainingSession } from '../types';
import { apiFetch } from './api';

/**
 * Fetch all training sessions for a player.
 * Returns an empty array if the player has no sessions (backend returns []).
 */
export async function getSessionsByPlayer(playerId: string): Promise<TrainingSession[]> {
  return apiFetch<TrainingSession[]>(`/api/sessions?playerId=${encodeURIComponent(playerId)}`);
}

/**
 * Fetch a single training session by its unique id.
 * Used on the session detail page.
 */
export async function getSessionById(id: string): Promise<TrainingSession> {
  return apiFetch<TrainingSession>(`/api/sessions/${id}`);
}
