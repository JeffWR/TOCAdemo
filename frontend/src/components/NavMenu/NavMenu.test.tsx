import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NavMenu } from './NavMenu';

function renderNav(path = '/'): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <NavMenu />
    </MemoryRouter>,
  );
}

describe('NavMenu', () => {
  it('renders a Home link', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /home/i })).toBeDefined();
  });

  it('renders an About TOCA link', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /about toca/i })).toBeDefined();
  });

  it('renders a Profile link', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /profile/i })).toBeDefined();
  });

  it('Home link points to /', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /home/i }).getAttribute('href')).toBe('/');
  });

  it('About TOCA link points to /about', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /about toca/i }).getAttribute('href')).toBe('/about');
  });

  it('Profile link points to /profile', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /profile/i }).getAttribute('href')).toBe('/profile');
  });
});
