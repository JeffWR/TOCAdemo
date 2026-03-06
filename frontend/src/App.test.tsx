import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App routing', () => {
  it('renders the login page at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('redirects unauthenticated user from / to /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('redirects unknown paths to / (then to /login when unauthenticated)', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });
});
