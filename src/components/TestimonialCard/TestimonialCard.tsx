import { ExternalLink, Quote } from 'lucide-react';
import type { Testimonial } from '../../content/testimonials';
import './TestimonialCard.css';

const sourceLabel = { google: 'Google review', instagram: 'Instagram', direct: 'Member testimonial' } as const;

/** Only ever rendered with verified, consented testimonials (see publishedTestimonials()). */
export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="testimonial-card reveal">
      <Quote size={30} className="testimonial-card__mark" aria-hidden="true" />
      <blockquote>
        <p>{t.quote}</p>
      </blockquote>
      <figcaption>
        <span className="testimonial-card__name">{t.displayName}</span>
        <span className="testimonial-card__meta">
          {t.sourceUrl ? (
            <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel[t.source]} <ExternalLink size={13} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            sourceLabel[t.source]
          )}
          {t.date && <> · {t.date}</>}
        </span>
      </figcaption>
    </figure>
  );
}
