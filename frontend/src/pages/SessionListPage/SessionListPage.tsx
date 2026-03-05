import type { ReactElement } from 'react';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SessionList } from '../../components/SessionList';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

export default function SessionListPage(): ReactElement {
  const { loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();

  const loading = profileLoading || sessionsLoading;
  const error = profileError ?? sessionsError;

  if (loading) return <LoadingSpinner label="Loading sessions" />;
  if (error !== null) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-gray-900">Training Sessions</h1>
      <SessionList sessions={sessions} />
    </section>
  );
}
