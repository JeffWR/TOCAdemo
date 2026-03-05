import type { Profile } from '../types';
import { apiFetch } from './api';

/**
 * Fetch a profile by email address.
 * Used on the login screen — the player types their email and we look them up.
 */
export async function getProfileByEmail(email: string): Promise<Profile> {
  // encodeURIComponent handles @, +, and other special characters in email addresses.
  const url = `/api/profiles?email=${encodeURIComponent(email)}`;
  return apiFetch<Profile>(url);
}

/**
 * Fetch a profile by its unique id.
 * Used when the id is already known (e.g. refreshing player context).
 */
export async function getProfileById(id: string): Promise<Profile> {
  return apiFetch<Profile>(`/api/profiles/${id}`);
}
