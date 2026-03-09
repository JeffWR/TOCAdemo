import type { ReactElement } from 'react';

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps): ReactElement {
  return (
    <div>
      <p className="font-poppins text-3xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wider text-white/50">{label}</p>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  children: string;
}

function InfoCard({ title, children }: InfoCardProps): ReactElement {
  return (
    <div className="rounded-xl border-l-4 border-toca-purple bg-white px-6 py-5 shadow-sm">
      <h2 className="font-poppins mb-2 text-xs font-bold uppercase tracking-widest text-toca-navy/50">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-gray-600">{children}</p>
    </div>
  );
}

export default function AboutPage(): ReactElement {
  return (
    <div className="space-y-8">
      {/* Title + technology description */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-toca-purple">
          Official Partner of Major League Soccer
        </p>
        <h1 className="font-poppins mb-4 text-5xl font-bold text-toca-navy">About TOCA</h1>
        <p className="text-base leading-relaxed text-gray-600">
          TOCA Football pairs certified trainers with proprietary ball-delivery machines and a
          real-time capture system that records every touch, goal, and sprint. Founded by former MLS
          and Premier League professional Eddie Lewis, the platform turns each training rep into a
          data point — so players stop guessing and start improving with evidence.
        </p>
      </div>

      {/* Detail cards — 3-column grid on wide screens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard title="How it works">
          Each session pairs you with a certified TOCA trainer and a ball-delivery machine that
          tracks every touch. Goals, best streak, average speed of play, and overall score are
          recorded automatically so you can see exactly how you improve over time.
        </InfoCard>

        <InfoCard title="Your portal">
          This player portal gives you a personal view of your training history and upcoming
          appointments. Review your stats after every session, spot your strongest areas, and arrive
          at your next appointment ready to push further.
        </InfoCard>

        <InfoCard title="Find a center">
          TOCA offers classes for ages 1–13, individual and group training from age 7, camps,
          leagues, and pickup games. Visit your nearest center to book sessions or speak with a
          trainer about a personalised development programme.
        </InfoCard>
      </div>

      {/* Hero stats panel — full width */}
      <div className="rounded-2xl bg-gradient-to-br from-toca-navy via-[#0a1a8a] to-[#120e90] px-10 py-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-toca-purple">
          By the numbers
        </p>
        <p className="font-poppins mb-10 text-3xl font-bold text-white">
          Where players find their best.
        </p>
        <div className="flex gap-16 border-t border-white/10 pt-8">
          <Stat value="50,000+" label="Players trained" />
          <Stat value="37+" label="Centers" />
          <Stat value="MLS" label="Official partner" />
        </div>
      </div>

      {/* External link */}
      <a
        href="https://www.tocafootball.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-toca-navy/20 bg-white px-5 py-3 text-sm font-semibold text-toca-navy shadow-sm transition-all duration-200 hover:border-toca-navy/40 hover:shadow-md"
      >
        Visit tocafootball.com
        <span aria-hidden="true" className="text-toca-navy/40">
          &rarr;
        </span>
      </a>
    </div>
  );
}
