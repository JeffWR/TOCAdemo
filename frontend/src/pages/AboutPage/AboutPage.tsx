import type { ReactElement } from 'react';

export default function AboutPage(): ReactElement {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">About TOCA</h1>

      <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <p>
          <strong>TOCA</strong> is a cutting-edge football training platform that combines
          proprietary technology with expert coaching to help players of all levels reach
          their full potential.
        </p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-gray-900">How it works</h2>
          <p>
            Each session pairs you with a certified TOCA trainer and a ball-delivery machine
            that tracks every touch. Metrics like goals, best streak, average speed of play,
            and overall score are recorded automatically so you can see exactly how you improve
            over time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Your portal</h2>
          <p>
            This player portal gives you a personal view of your training history and upcoming
            appointments. Review your stats after every session, spot your strongest areas, and
            arrive at your next appointment ready to push further.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Get in touch</h2>
          <p>
            Visit your local TOCA center to book sessions or speak with a trainer about a
            personalised development programme.
          </p>
        </section>
      </div>
    </div>
  );
}
