import type { ApiResponse } from '../types';

/**
 * Thrown when the server responds with { success: false, error: string }.
 * Consumers can catch and narrow with instanceof ApiError.
 */
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch wrapper for all API calls.
 * - Unwraps the { success, data/error } envelope.
 * - Returns data on success.
 * - Throws ApiError on application-level errors.
 * - Lets network errors propagate as-is.
 */
export async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);

  // Check HTTP status before parsing — catches gateway errors, proxy timeouts, etc.
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`);
  }

  // Wrap JSON parse separately so a non-JSON body gives a clean error, not a SyntaxError.
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ApiError('Server returned an invalid response');
  }

  // Narrow the envelope at runtime before trusting the shape.
  if (
    typeof json !== 'object' ||
    json === null ||
    !('success' in json) ||
    typeof (json as Record<string, unknown>)['success'] !== 'boolean'
  ) {
    throw new ApiError('Unexpected response format from server');
  }

  const envelope = json as ApiResponse<T>;

  if (!envelope.success) {
    // Validate the error message is a non-empty string before forwarding it.
    const message =
      typeof envelope.error === 'string' && envelope.error.length > 0
        ? envelope.error
        : 'An unexpected error occurred';
    throw new ApiError(message);
  }

  return envelope.data;
}
