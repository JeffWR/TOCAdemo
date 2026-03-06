import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatBadge } from '../../components/StatBadge';
import { useSession } from '../../hooks/useSession';
import { formatDate } from '../../utils/formatters';

export default function SessionDetailPage(): ReactElement {
  const { id = '' } = useParams<{ id: string }>();
  const { session, loading, error } = useSession(id);

  if (loading) return <LoadingSpinner label="Loading session" />;
  if (error !== null) return <ErrorMessage message={error} />;
  if (session === null) return <ErrorMessage message="Session not found" />;

  return (
    <section>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-toca-navy/50 hover:text-toca-navy transition-colors"
      >
        ← Dashboard
      </Link>
      <h1 className="font-poppins mb-1 text-2xl font-bold text-toca-navy">{session.trainerName}</h1>
      <p className="mb-8 text-sm text-gray-400">{formatDate(session.startTime)}</p>
      <div className="flex flex-wrap gap-3">
        <StatBadge label="Score" value={session.score} />
        <StatBadge label="Goals" value={session.numberOfGoals} />
        <StatBadge label="Best Streak" value={session.bestStreak} />
        <StatBadge label="Balls" value={session.numberOfBalls} />
        <StatBadge label="Avg Speed" value={session.avgSpeedOfPlay} />
        <StatBadge label="Exercises" value={session.numberOfExercises} />
      </div>
    </section>
  );
}
