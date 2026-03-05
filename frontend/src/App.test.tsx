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

  it('redirects unauthenticated user from /sessions to /login', () => {
    render(
      <MemoryRouter initialEntries={['/sessions']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('redirects / to /sessions (which then redirects to /login when unauthenticated)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    // / → /sessions → /login (unauthenticated)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });
});
