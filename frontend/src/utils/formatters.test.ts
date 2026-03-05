import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from './formatters';

describe('formatDate', () => {
  it('formats a valid ISO date to short month/day/year', () => {
    expect(formatDate('2024-03-01T09:00:00Z')).toBe('Mar 1, 2024');
  });

  it('returns fallback for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });

  it('returns fallback for an empty string', () => {
    expect(formatDate('')).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('formats a valid ISO datetime to short month/day/year + time', () => {
    const result = formatDateTime('2024-04-10T14:00:00Z');
    // Time part is locale/timezone dependent; just assert date portion is present
    expect(result).toContain('Apr 10, 2024');
  });

  it('returns fallback for an invalid datetime string', () => {
    expect(formatDateTime('bad-input')).toBe('—');
  });

  it('returns fallback for an empty string', () => {
    expect(formatDateTime('')).toBe('—');
  });
});
