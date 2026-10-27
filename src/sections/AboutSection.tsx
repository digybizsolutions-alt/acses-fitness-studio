import { asset } from '../lib/asset';
import { CTAButton, SectionHead } from '../components/common';
import { approachSteps } from '../content/approach';

/** Assess → Plan → Coach → Review. (Process wording to be confirmed with ACSES.) */
export default function AboutSection({ withLink = true }: { withLink?: boolean }) {
  return (
    <section className="section section--surface approach" aria-labelledby="approach-title">
      <div className="approach__media" aria-hidden="true">
        <img src={asset('images/track-drills.jpg')} alt="" loading="lazy" width={200} height={410} />
      </div>
      <div className="container">
        <SectionHead
          eyebrow="The ACSES approach"
          title={
            <span id="approach-title">
              Assess. Plan. <em>Coach.</em> Review.
            </span>
          }
          lede="Great training isn't random. Every programme at ACSES follows a simple, repeatable process — so you always know why you're doing what you're doing."
        />
        <ol className="approach__steps">
          {approachSteps.map((s, i) => (
            <li key={s.id} className="approach__step reveal" style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
              <span className="approach__num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        {withLink && (
          <div className="reveal" style={{ marginTop: 48 }}>
            <CTAButton to="/about" variant="ghost">
              About ACSES
            </CTAButton>
          </div>
        )}
      </div>
    </section>
  );
}
