import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch, ApiError } from './api';

// We stub the global fetch — no real network calls in unit tests.
// Each test resets stubs via beforeEach → vi.restoreAllMocks()

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('apiFetch', () => {
  it('returns data when the envelope has success: true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: '1', name: 'Test' } }),
      }),
    );

    const result = await apiFetch<{ id: string; name: string }>('/api/test');

    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('throws ApiError with the server message when success: false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Not found' }),
      }),
    );

    const rejection = apiFetch('/api/test');
    await expect(rejection).rejects.toThrow('Not found');
    await expect(rejection).rejects.toBeInstanceOf(ApiError);
  });

  it('propagates network-level errors (fetch rejects)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

    await expect(apiFetch('/api/test')).rejects.toThrow('Network failure');
  });

  it('throws ApiError when HTTP status is not ok (e.g. 404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: vi.fn() }));

    const rejection = apiFetch('/api/test');
    await expect(rejection).rejects.toThrow('Request failed with status 404');
    await expect(rejection).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError when the response body is not valid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      }),
    );

    const rejection = apiFetch('/api/test');
    await expect(rejection).rejects.toThrow('Server returned an invalid response');
    await expect(rejection).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError with fallback message when error field is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: '' }),
      }),
    );

    await expect(apiFetch('/api/test')).rejects.toThrow('An unexpected error occurred');
  });

  it('throws ApiError when response is not the expected envelope shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve('plain string'),
      }),
    );

    await expect(apiFetch('/api/test')).rejects.toThrow('Unexpected response format from server');
  });

  it('calls fetch with the exact URL supplied', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: null }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiFetch('/api/profiles?email=test@example.com');

    expect(mockFetch).toHaveBeenCalledWith('/api/profiles?email=test@example.com');
  });
});

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const err = new ApiError('something broke');
    expect(err).toBeInstanceOf(Error);
  });

  it('has the name ApiError', () => {
    const err = new ApiError('something broke');
    expect(err.name).toBe('ApiError');
  });

  it('carries the message passed to it', () => {
    const err = new ApiError('custom message');
    expect(err.message).toBe('custom message');
  });
});
