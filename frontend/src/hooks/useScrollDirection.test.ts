import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScrollDirection } from './useScrollDirection';

function setScrollY(y: number): void {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
}

function fireScroll(y: number): void {
  setScrollY(y);
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

afterEach(() => {
  // Reset scrollY to 0 between tests
  setScrollY(0);
});

describe('useScrollDirection', () => {
  it('starts as "up" by default', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe('up');
  });

  it('returns "down" when scrolling down past the top zone', () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(100);
    expect(result.current).toBe('down');
  });

  it('returns "up" when scrolling back up', () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(200);
    fireScroll(100);
    expect(result.current).toBe('up');
  });

  it('stays "up" when within the top zone even if scrolling down', () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(30);
    expect(result.current).toBe('up');
  });

  it('ignores movements smaller than the jitter threshold', () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(200);
    // micro movement of 3px — below the 5px threshold
    fireScroll(203);
    expect(result.current).toBe('down');
  });
});
