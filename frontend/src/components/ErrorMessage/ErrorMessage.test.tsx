import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the error text', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  it('has role="alert" for accessibility', () => {
    render(<ErrorMessage message="Network error" />);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders a default heading', () => {
    render(<ErrorMessage message="Timed out" />);
    expect(screen.getByText('Error')).toBeDefined();
  });

  it('accepts a custom heading', () => {
    render(<ErrorMessage message="Not found" heading="Profile missing" />);
    expect(screen.getByText('Profile missing')).toBeDefined();
  });
});
