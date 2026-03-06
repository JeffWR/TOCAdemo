import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders the main heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about toca/i })).toBeDefined();
  });

  it('renders content about TOCA', () => {
    render(<AboutPage />);
    expect(screen.getByText(/50,000\+/)).toBeDefined();
  });

  it('renders a link to the TOCA website', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /tocafootball\.com/i });
    expect(link.getAttribute('href')).toBe('https://www.tocafootball.com');
  });
});
