import { asset } from '../../lib/asset';
import type { Coach } from '../../content/coaches';
import { DraftBadge } from '../common';
import './CoachCard.css';

export default function CoachCard({ coach, index }: { coach: Coach; index: number }) {
  return (
    <article className="coach-card reveal" style={{ ['--reveal-delay' as string]: `${index * 90}ms` }}>
      <div className="coach-card__photo">
        {coach.photo ? (
          <img src={asset(coach.photo)} alt={`${coach.name}, ${coach.role} at ACSES Fitness Studio`} loading="lazy" width={480} height={600} />
        ) : (
          <div className="coach-card__placeholder" aria-hidden="true">
            <img src={asset('acses-logo.png')} alt="" width={96} height={96} />
            <span>Approved portrait</span>
          </div>
        )}
        <span className="coach-card__role">{coach.role}</span>
      </div>
      <div className="coach-card__body">
        <h3 className="coach-card__name">{coach.name}</h3>
        <p className="muted">{coach.bio}</p>
        {coach.qualifications.length > 0 && (
          <ul className="coach-card__quals" aria-label="Qualifications">
            {coach.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        )}
        <ul className="coach-card__tags" aria-label="Specialties">
          {coach.specialties.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {!coach.verified && <DraftBadge label="Profile pending" />}
      </div>
    </article>
  );
}
