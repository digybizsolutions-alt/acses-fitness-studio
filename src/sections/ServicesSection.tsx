import ServiceCard from '../components/ServiceCard/ServiceCard';
import { CTAButton, SectionHead } from '../components/common';
import { services } from '../content/services';
import { isPublishable } from '../content/siteConfig';

export default function ServicesSection({ limit }: { limit?: number }) {
  const list = services.filter(isPublishable).slice(0, limit);
  if (list.length === 0) return null;
  return (
    <section className="section" id="programmes" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          split
          eyebrow="Programmes"
          title={
            <span id="services-title">
              Training with <em>purpose</em>
            </span>
          }
          lede="Structured, coach-led programmes for strength, movement and wellness — each one built around where you are today."
          aside={limit ? <CTAButton to="/services" variant="ghost" size="sm">All programmes</CTAButton> : undefined}
        />
        <div className="grid grid--3">
          {list.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
