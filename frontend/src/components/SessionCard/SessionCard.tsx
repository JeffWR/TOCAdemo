import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { TrainingSession } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StatBadge } from '../StatBadge';

interface SessionCardProps {
  session: TrainingSession;
}

export function SessionCard({ session }: SessionCardProps): ReactElement {
  return (
    <Link
      to={`/sessions/${session.id}`}
      aria-label={`Training session with ${session.trainerName} on ${formatDate(session.startTime)}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">{session.trainerName}</span>
        <span className="text-xs text-gray-400">{formatDate(session.startTime)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <StatBadge label="Score" value={session.score} />
        <StatBadge label="Goals" value={session.numberOfGoals} />
        <StatBadge label="Best Streak" value={session.bestStreak} />
        <StatBadge label="Exercises" value={session.numberOfExercises} />
      </div>
    </Link>
  );
}
