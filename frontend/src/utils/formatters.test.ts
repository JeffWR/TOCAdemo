import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatDuration } from './formatters';

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

describe('formatDuration', () => {
  it('formats a 1-hour session as "1h 0m"', () => {
    expect(formatDuration('2024-03-01T09:00:00Z', '2024-03-01T10:00:00Z')).toBe('1h 0m');
  });

  it('formats a sub-hour session as minutes only', () => {
    expect(formatDuration('2024-03-01T09:00:00Z', '2024-03-01T09:45:00Z')).toBe('45m');
  });

  it('formats a 1h 30m session correctly', () => {
    expect(formatDuration('2024-03-01T09:00:00Z', '2024-03-01T10:30:00Z')).toBe('1h 30m');
  });

  it('returns fallback for an invalid start time', () => {
    expect(formatDuration('not-a-date', '2024-03-01T10:00:00Z')).toBe('—');
  });

  it('returns fallback for an invalid end time', () => {
    expect(formatDuration('2024-03-01T09:00:00Z', 'not-a-date')).toBe('—');
  });
});
