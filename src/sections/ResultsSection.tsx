import { CheckCircle2 } from 'lucide-react';
import TestimonialCard from '../components/TestimonialCard/TestimonialCard';
import { SectionHead } from '../components/common';
import { memberValues, publishedTestimonials } from '../content/testimonials';

/**
 * Shows verified testimonials when they exist; otherwise the neutral
 * "What members value" principles (requirements §8) — never fake reviews.
 */
export default function ResultsSection() {
  const reviews = publishedTestimonials();

  if (reviews.length > 0) {
    return (
      <section className="section" aria-labelledby="reviews-title">
        <div className="container">
          <SectionHead eyebrow="Reviews" title={<span id="reviews-title">In their <em>words</em></span>} />
          <div className="grid grid--3">
            {reviews.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section values" aria-labelledby="values-title">
      <div className="container values__inner">
        <SectionHead
          eyebrow="What members value"
          title={
            <span id="values-title">
              Built on <em>coaching</em>, not shortcuts
            </span>
          }
          lede="The principles behind every ACSES programme."
        />
        <ul className="values__list">
          {memberValues.map((v, i) => (
            <li key={v.title} className="values__item reveal" style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}>
              <CheckCircle2 size={22} aria-hidden="true" />
              <div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
