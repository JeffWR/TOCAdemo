import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default aria-label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.getByLabelText('Loading')).toBeDefined();
  });

  it('renders with a custom aria-label', () => {
    render(<LoadingSpinner label="Fetching sessions" />);
    expect(screen.getByLabelText('Fetching sessions')).toBeDefined();
  });

  it('spinner visual has animate-spin class', () => {
    render(<LoadingSpinner />);
    const visual = screen.getByTestId('spinner-visual');
    expect(visual.className).toContain('animate-spin');
  });

  it('spinner visual is hidden from assistive technology', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('spinner-visual').getAttribute('aria-hidden')).toBe('true');
  });
});
