import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import { Layout } from './Layout';

function renderLayout(): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="test@example.com">
        <Layout>
          <p>Page content</p>
        </Layout>
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders the Header inside the layout', () => {
    renderLayout();
    expect(screen.getByText('TOCA')).toBeDefined();
  });

  it('renders children inside a main element', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toBeDefined();
    expect(main.textContent).toContain('Page content');
  });
});
