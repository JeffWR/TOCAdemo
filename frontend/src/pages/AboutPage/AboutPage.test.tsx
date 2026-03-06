import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders the About TOCA heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about toca/i })).toBeDefined();
  });

  it('renders content about TOCA', () => {
    render(<AboutPage />);
    expect(screen.getByText(/cutting-edge football training platform/i)).toBeDefined();
  });
});
