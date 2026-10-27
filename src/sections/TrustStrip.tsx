import { ClipboardCheck, Gauge, MapPin, Users } from 'lucide-react';
import { siteConfig } from '../content/siteConfig';

/**
 * Only statements about ACSES's approach — no numbers, ratings or counts until verified.
 */
const items = [
  { icon: Users, title: 'Coaching-led', text: 'Every session guided by a coach' },
  { icon: ClipboardCheck, title: 'Assessment first', text: 'Training starts from how you move' },
  { icon: Gauge, title: 'Progress reviewed', text: 'Plans that evolve with you' },
  { icon: MapPin, title: siteConfig.city, text: 'Strength • Movement • Wellness' },
];

export default function TrustStrip() {
  return (
    <section className="trust" aria-label="Our approach at a glance">
      <div className="container">
        <ul className="trust__list">
          {items.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="trust__item reveal" style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}>
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
