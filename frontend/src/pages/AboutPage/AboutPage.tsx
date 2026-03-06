import type { ReactElement } from 'react';

export default function AboutPage(): ReactElement {
  return (
    <div className="max-w-2xl">
      <h1 className="font-poppins mb-2 text-3xl font-bold text-toca-navy">About TOCA</h1>
      <p className="mb-8 text-sm text-toca-purple font-semibold uppercase tracking-wider">
        Official Partner of MLS
      </p>

      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-gray-600">
          <strong className="text-toca-navy">TOCA</strong> is a cutting-edge football training
          platform that combines proprietary technology with expert coaching to help players of all
          levels reach their full potential.
        </p>

        <div className="rounded-xl border border-toca-navy/10 bg-white p-6 shadow-sm">
          <h2 className="font-poppins mb-2 text-sm font-bold uppercase tracking-wider text-toca-navy">
            How it works
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Each session pairs you with a certified TOCA trainer and a ball-delivery machine that
            tracks every touch. Metrics like goals, best streak, average speed of play, and overall
            score are recorded automatically so you can see exactly how you improve over time.
          </p>
        </div>

        <div className="rounded-xl border border-toca-navy/10 bg-white p-6 shadow-sm">
          <h2 className="font-poppins mb-2 text-sm font-bold uppercase tracking-wider text-toca-navy">
            Your portal
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            This player portal gives you a personal view of your training history and upcoming
            appointments. Review your stats after every session, spot your strongest areas, and
            arrive at your next appointment ready to push further.
          </p>
        </div>

        <div className="rounded-xl border border-toca-navy/10 bg-white p-6 shadow-sm">
          <h2 className="font-poppins mb-2 text-sm font-bold uppercase tracking-wider text-toca-navy">
            Get in touch
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Visit your local TOCA center to book sessions or speak with a trainer about a
            personalised development programme.
          </p>
        </div>
      </div>
    </div>
  );
}
