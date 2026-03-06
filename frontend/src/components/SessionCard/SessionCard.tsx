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
      className="group block rounded-xl border border-toca-navy/10 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-toca-navy/30"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-poppins text-sm font-semibold text-toca-navy">
          {session.trainerName}
        </span>
        <span className="text-xs font-medium text-gray-400">{formatDate(session.startTime)}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <StatBadge label="Score" value={session.score} />
        <StatBadge label="Goals" value={session.numberOfGoals} />
        <StatBadge label="Best Streak" value={session.bestStreak} />
        <StatBadge label="Exercises" value={session.numberOfExercises} />
      </div>
    </Link>
  );
}
