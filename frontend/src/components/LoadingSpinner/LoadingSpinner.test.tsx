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

  it('applies the animate-spin class for the spinner visual', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status').firstElementChild;
    expect(spinner?.className).toContain('animate-spin');
  });
});
