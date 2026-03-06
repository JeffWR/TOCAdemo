import type { ReactElement } from 'react';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePlayerContext } from '../../context/PlayerContext';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';
import type { TrainingSession } from '../../types';
import { formatDate } from '../../utils/formatters';

function Avatar({ firstName, lastName }: { firstName: string; lastName: string }): ReactElement {
  const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase();
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 font-poppins text-2xl font-bold text-white ring-4 ring-white/10">
      {initials}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }): ReactElement {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="font-poppins text-2xl font-bold text-toca-navy">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-toca-navy/50">{label}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-toca-navy/50">{label}</p>
      <p className="text-sm font-medium text-toca-navy">{value}</p>
    </div>
  );
}

const CHART_W = 800;
const CHART_H = 90;

function ScoreChart({ sessions }: { sessions: TrainingSession[] }): ReactElement {
  const data = [...sessions]
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(-16);
  const n = data.length;
  const gap = 4;
  const barW = (CHART_W - gap * (n - 1)) / n;
  const avg = data.reduce((s, x) => s + x.score, 0) / n;
  const avgY = CHART_H - (avg / 100) * CHART_H;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-toca-navy/50">
          Score trend — last {n} sessions
        </p>
        <p className="text-xs font-semibold text-toca-navy">Avg: {Math.round(avg)}</p>
      </div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full">
        {[25, 50, 75].map(pct => (
          <line key={pct} x1={0} y1={CHART_H - (pct / 100) * CHART_H} x2={CHART_W} y2={CHART_H - (pct / 100) * CHART_H} stroke="#051274" strokeWidth={0.5} strokeOpacity={0.06} />
        ))}
        {data.map((s, i) => {
          const h = (s.score / 100) * CHART_H;
          return <rect key={s.id} x={i * (barW + gap)} y={CHART_H - h} width={barW} height={h} rx={2} fill="#051274" fillOpacity={0.75} />;
        })}
        <line x1={0} y1={avgY} x2={CHART_W} y2={avgY} stroke="#aca1ff" strokeWidth={1.2} strokeDasharray="6 3" />
      </svg>
      <div className="mt-3 flex items-center gap-2">
        <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#aca1ff" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
        <p className="text-[10px] text-toca-navy/40">Average score</p>
      </div>
    </div>
  );
}

export default function ProfilePage(): ReactElement {
  const { loading: profileLoading, error: profileError } = useProfile();
  const { profile } = usePlayerContext();
  const { sessions, loading: sessionsLoading } = useSessions();

  if (profileLoading) return <LoadingSpinner label="Loading profile" />;
  if (profileError !== null) return <ErrorMessage message={profileError} />;
  if (profile === null) return <ErrorMessage message="Profile not available" />;

  const totalGoals = sessions.reduce((sum, s) => sum + s.numberOfGoals, 0);
  const avgScore = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length).toFixed(1)
    : '—';
  const bestStreak = sessions.reduce((max, s) => Math.max(max, s.bestStreak), 0);

  return (
    <div className="space-y-6">
      {/* Hero — full width, split layout */}
      <div className="rounded-2xl bg-gradient-to-br from-toca-navy via-[#0a1a8a] to-[#120e90] px-10 py-10">
        <div className="flex items-center justify-between gap-8">
          {/* Left: avatar + identity */}
          <div className="flex items-center gap-6">
            <Avatar firstName={profile.firstName} lastName={profile.lastName} />
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-toca-purple">{profile.centerName}</p>
              <h1 className="font-poppins mb-1 text-4xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-white/60">{profile.email}</p>
            </div>
          </div>
          {/* Right: meta */}
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Member since</p>
            <p className="mt-0.5 text-lg font-semibold text-white">{formatDate(profile.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Stats + chart */}
      {!sessionsLoading && sessions.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard value={String(sessions.length)} label="Sessions" />
            <StatCard value={String(totalGoals)} label="Total Goals" />
            <StatCard value={String(avgScore)} label="Avg Score" />
            <StatCard value={String(bestStreak)} label="Best Streak" />
          </div>
          {sessions.length >= 2 && <ScoreChart sessions={sessions} />}
        </>
      )}

      {/* Account details — 4 columns */}
      <div className="grid grid-cols-4 gap-4">
        <Field label="Phone" value={profile.phone} />
        <Field label="Date of Birth" value={formatDate(profile.dob)} />
        <Field label="Gender" value={profile.gender} />
        <Field label="Training Center" value={profile.centerName} />
      </div>
    </div>
  );
}
