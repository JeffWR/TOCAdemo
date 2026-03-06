import type { ReactElement } from 'react';
import { AppointmentList } from '../../components/AppointmentList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SessionList } from '../../components/SessionList';
import { usePlayerContext } from '../../context/PlayerContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

export default function HomePage(): ReactElement {
  // useProfile is called for its side effect: it fetches the profile and writes it
  // into PlayerContext. useSessions and useAppointments depend on that profile.id.
  const { loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments();
  const { profile } = usePlayerContext();

  const loading = profileLoading || sessionsLoading || apptLoading;
  const error = profileError ?? sessionsError ?? apptError;

  if (loading) return <LoadingSpinner label="Loading your dashboard" />;
  if (error !== null) return <ErrorMessage message={error} />;

  const upcomingCount = appointments.filter(a => new Date(a.startTime) > new Date()).length;

  return (
    <div className="space-y-8">
      {/* Welcome hero */}
      <div className="rounded-2xl bg-gradient-to-br from-toca-navy via-[#0a1a8a] to-[#120e90] px-10 py-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-toca-purple">
          Welcome back
        </p>
        <h1 className="font-poppins mb-3 text-4xl font-bold text-white">
          {profile !== null ? profile.firstName : 'Player'}
        </h1>
        <div className="flex gap-8 border-t border-white/10 pt-5">
          <div>
            <p className="font-poppins text-2xl font-bold text-white">{sessions.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Sessions completed</p>
          </div>
          <div>
            <p className="font-poppins text-2xl font-bold text-white">{upcomingCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Upcoming appointments</p>
          </div>
        </div>
      </div>

      {/* Content — sessions (wider) + appointments (sidebar) */}
      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-poppins mb-5 text-xl font-bold text-toca-navy">Training Sessions</h2>
          <SessionList sessions={sessions} />
        </section>

        <section>
          <h2 className="font-poppins mb-5 text-xl font-bold text-toca-navy">
            Upcoming Appointments
          </h2>
          <AppointmentList appointments={appointments} />
        </section>
      </div>
    </div>
  );
}
