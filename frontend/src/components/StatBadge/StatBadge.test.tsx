import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatBadge } from './StatBadge';

describe('StatBadge', () => {
  it('renders the label', () => {
    render(<StatBadge label="Score" value={85} />);
    expect(screen.getByText('Score')).toBeDefined();
  });

  it('renders a numeric value', () => {
    render(<StatBadge label="Goals" value={12} />);
    expect(screen.getByText('12')).toBeDefined();
  });

  it('renders a string value', () => {
    render(<StatBadge label="Trainer" value="Coach Alex" />);
    expect(screen.getByText('Coach Alex')).toBeDefined();
  });
});
