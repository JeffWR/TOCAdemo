import type { ReactElement } from 'react';

interface InfoCardProps {
  icon: string;
  title: string;
  children: string;
}

function InfoCard({ icon, title, children }: InfoCardProps): ReactElement {
  return (
    <div className="rounded-xl border border-toca-navy/10 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-toca-navy/8 text-base"
        >
          {icon}
        </span>
        <h2 className="font-poppins text-sm font-bold uppercase tracking-wider text-toca-navy">
          {title}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{children}</p>
    </div>
  );
}

export default function AboutPage(): ReactElement {
  return (
    <div className="max-w-2xl">
      <h1 className="font-poppins mb-2 text-3xl font-bold text-toca-navy">About TOCA</h1>
      <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-toca-purple">
        Official Partner of MLS
      </p>

      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-gray-600">
          <strong className="text-toca-navy">TOCA</strong> is a cutting-edge football training
          platform that combines proprietary technology with expert coaching to help players of all
          levels reach their full potential.
        </p>

        <InfoCard icon="⚽" title="How it works">
          Each session pairs you with a certified TOCA trainer and a ball-delivery machine that
          tracks every touch. Metrics like goals, best streak, average speed of play, and overall
          score are recorded automatically so you can see exactly how you improve over time.
        </InfoCard>

        <InfoCard icon="📊" title="Your portal">
          This player portal gives you a personal view of your training history and upcoming
          appointments. Review your stats after every session, spot your strongest areas, and arrive
          at your next appointment ready to push further.
        </InfoCard>

        <InfoCard icon="📍" title="Get in touch">
          Visit your local TOCA center to book sessions or speak with a trainer about a personalised
          development programme.
        </InfoCard>
      </div>
    </div>
  );
}
