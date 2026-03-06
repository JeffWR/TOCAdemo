import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ComparisonRow } from '../../components/ComparisonRow';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatBadge } from '../../components/StatBadge';
import { useSession } from '../../hooks/useSession';
import { useSessions } from '../../hooks/useSessions';
import { formatDate, formatDuration } from '../../utils/formatters';

export default function SessionDetailPage(): ReactElement {
  const { id = '' } = useParams<{ id: string }>();
  const { session, loading: sessionLoading, error: sessionError } = useSession(id);
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();

  const loading = sessionLoading || sessionsLoading;
  const error = sessionError ?? sessionsError;

  if (loading) return <LoadingSpinner label="Loading session" />;
  if (error !== null) return <ErrorMessage message={error} />;
  if (session === null) return <ErrorMessage message="Session not found" />;

  const count = sessions.length || 1;
  const avg = {
    score: sessions.reduce((s, x) => s + x.score, 0) / count,
    goals: sessions.reduce((s, x) => s + x.numberOfGoals, 0) / count,
    streak: sessions.reduce((s, x) => s + x.bestStreak, 0) / count,
    balls: sessions.reduce((s, x) => s + x.numberOfBalls, 0) / count,
    exercises: sessions.reduce((s, x) => s + x.numberOfExercises, 0) / count,
  };

  return (
    <section>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-toca-navy/50 transition-colors hover:text-toca-navy"
      >
        ← Dashboard
      </Link>

      <h1 className="font-poppins mb-1 text-2xl font-bold text-toca-navy">{session.trainerName}</h1>
      <p className="mb-4 text-sm text-gray-400">{formatDate(session.startTime)}</p>

      <div className="mb-5 flex flex-wrap gap-3">
        <StatBadge label="Duration" value={formatDuration(session.startTime, session.endTime)} />
        <StatBadge label="Avg Speed" value={session.avgSpeedOfPlay} />
        <StatBadge label="Balls" value={session.numberOfBalls} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
        <ComparisonRow label="Score" thisValue={session.score} avgValue={avg.score} />
        <ComparisonRow label="Goals" thisValue={session.numberOfGoals} avgValue={avg.goals} />
        <ComparisonRow label="Best Streak" thisValue={session.bestStreak} avgValue={avg.streak} />
        <ComparisonRow label="Balls" thisValue={session.numberOfBalls} avgValue={avg.balls} />
        <ComparisonRow
          label="Exercises"
          thisValue={session.numberOfExercises}
          avgValue={avg.exercises}
        />
      </div>
    </section>
  );
}
