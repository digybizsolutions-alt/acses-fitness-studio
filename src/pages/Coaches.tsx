import { PageHero, SectionHead } from '../components/common';
import CoachCard from '../components/CoachCard/CoachCard';
import EnquirySection from '../sections/EnquirySection';
import { coaches } from '../content/coaches';
import { coachingPillars } from '../content/approach';
import { isPublishable } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Coaches() {
  usePageMeta('Coaches', 'Meet the ACSES coaching team — coaches developed across anatomy, assessment, programming and performance.');
  const list = coaches.filter(isPublishable);
  return (
    <>
      <PageHero
        eyebrow="Coaches"
        title={
          <>
            The team <em>behind</em> the work
          </>
        }
        lede="Coaching is the heart of ACSES. Our team develops through a structured pathway so every session is guided by real understanding."
        image="/images/coach-assessment.jpg"
      />
      <section className="section">
        <div className="container">
          {list.length > 0 ? (
            <div className="grid grid--3">
              {list.map((c, i) => (
                <CoachCard key={c.id} coach={c} index={i} />
              ))}
            </div>
          ) : (
            <SectionHead eyebrow="Team profiles" title="Coach profiles coming soon" lede="Approved team profiles will be published here shortly." />
          )}
        </div>
      </section>
      <section className="section section--surface section--tight">
        <div className="container">
          <SectionHead eyebrow="Coach development" title={<>How our coaches <em>grow</em></>} />
          <ul className="pillars pillars--row">
            {coachingPillars.map((p, i) => (
              <li key={p} className="reveal" style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <EnquirySection showDetails={false} />
    </>
  );
}
