import type { ReactElement } from 'react';
import type { TrainingSession } from '../../types';
import { SessionCard } from '../SessionCard';

interface SessionListProps {
  sessions: TrainingSession[];
}

export function SessionList({ sessions }: SessionListProps): ReactElement {
  if (sessions.length === 0) {
    return <p className="text-sm text-gray-500">No training sessions yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {sessions.map(session => (
        <li key={session.id}>
          <SessionCard session={session} />
        </li>
      ))}
    </ul>
  );
}
