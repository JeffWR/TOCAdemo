import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { TrainingSession } from '../../types';
import { SessionCard } from './SessionCard';

const session: TrainingSession = {
  id: 's1',
  playerId: 'p1',
  trainerName: 'Coach Alex',
  startTime: '2024-03-01T09:00:00Z',
  endTime: '2024-03-01T10:00:00Z',
  numberOfBalls: 200,
  bestStreak: 15,
  numberOfGoals: 12,
  score: 87,
  avgSpeedOfPlay: 3.4,
  numberOfExercises: 6,
};

function renderCard(): void {
  render(
    <MemoryRouter>
      <SessionCard session={session} />
    </MemoryRouter>,
  );
}

describe('SessionCard', () => {
  it('renders trainer name', () => {
    renderCard();
    expect(screen.getByText('Coach Alex')).toBeDefined();
  });

  it('renders the score stat', () => {
    renderCard();
    expect(screen.getByText('87')).toBeDefined();
  });

  it('renders the goals stat', () => {
    renderCard();
    expect(screen.getByText('12')).toBeDefined();
  });

  it('renders the best streak stat', () => {
    renderCard();
    expect(screen.getByText('15')).toBeDefined();
  });

  it('contains a link using the session id', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('s1');
  });
});
