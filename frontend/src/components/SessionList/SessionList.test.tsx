import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { TrainingSession } from '../../types';
import { SessionList } from './SessionList';

const sessions: TrainingSession[] = [
  {
    id: 's1',
    playerId: 'p1',
    trainerName: 'Coach A',
    startTime: '2024-03-01T09:00:00Z',
    endTime: '2024-03-01T10:00:00Z',
    numberOfBalls: 200,
    bestStreak: 10,
    numberOfGoals: 8,
    score: 80,
    avgSpeedOfPlay: 3.0,
    numberOfExercises: 5,
  },
  {
    id: 's2',
    playerId: 'p1',
    trainerName: 'Coach B',
    startTime: '2024-03-05T09:00:00Z',
    endTime: '2024-03-05T10:00:00Z',
    numberOfBalls: 180,
    bestStreak: 12,
    numberOfGoals: 9,
    score: 85,
    avgSpeedOfPlay: 3.2,
    numberOfExercises: 6,
  },
];

function renderList(s: TrainingSession[]): void {
  render(
    <MemoryRouter>
      <SessionList sessions={s} />
    </MemoryRouter>,
  );
}

describe('SessionList', () => {
  it('renders a card for each session', () => {
    renderList(sessions);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('renders session trainer names', () => {
    renderList(sessions);
    expect(screen.getByText('Coach A')).toBeDefined();
    expect(screen.getByText('Coach B')).toBeDefined();
  });

  it('shows empty state message when sessions array is empty', () => {
    renderList([]);
    expect(screen.getByText('No training sessions yet.')).toBeDefined();
  });
});
