import { Link } from 'react-router-dom';
import { Activity, Apple, ArrowUpRight, Dumbbell, Move, Stethoscope, User } from 'lucide-react';
import type { Service, ServiceIcon } from '../../content/services';
import { DraftBadge } from '../common';
import './ServiceCard.css';

export const serviceIcons: Record<ServiceIcon, typeof Dumbbell> = {
  dumbbell: Dumbbell,
  user: User,
  activity: Activity,
  move: Move,
  apple: Apple,
  stethoscope: Stethoscope,
};

export default function ServiceCard({ service, index, detailed = false }: { service: Service; index: number; detailed?: boolean }) {
  const Icon = serviceIcons[service.icon];
  return (
    <article className="service-card reveal" style={{ ['--reveal-delay' as string]: `${(index % 3) * 80}ms` }} id={detailed ? service.id : undefined}>
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="service-card__num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__summary">{detailed ? service.detail : service.summary}</p>
      {detailed && (
        <ul className="service-card__focus">
          {service.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <div className="service-card__foot">
        <Link
          to={`/contact?interest=${encodeURIComponent(service.title)}#enquire`}
          className="service-card__link"
          aria-label={`Enquire about ${service.title}`}
        >
          Enquire <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        {!service.verified && <DraftBadge />}
      </div>
    </article>
  );
}
