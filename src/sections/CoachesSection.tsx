import CoachCard from '../components/CoachCard/CoachCard';
import { CTAButton, SectionHead } from '../components/common';
import { coaches } from '../content/coaches';
import { isPublishable } from '../content/siteConfig';

export default function CoachesSection({ withLink = true }: { withLink?: boolean }) {
  const list = coaches.filter(isPublishable);
  if (list.length === 0) return null; // hidden until real, approved profiles exist
  return (
    <section className="section" aria-labelledby="coaches-title">
      <div className="container">
        <SectionHead
          split
          eyebrow="Coaches"
          title={
            <span id="coaches-title">
              Coached by people who <em>know</em> movement
            </span>
          }
          lede="Our team develops across anatomy, assessment, programming and coaching — so every session is guided by real expertise."
          aside={withLink ? <CTAButton to="/coaches" variant="ghost" size="sm">Meet the team</CTAButton> : undefined}
        />
        <div className="grid grid--3">
          {list.map((c, i) => (
            <CoachCard key={c.id} coach={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
