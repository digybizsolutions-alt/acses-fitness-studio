import { asset } from '../lib/asset';
import { ShieldCheck } from 'lucide-react';
import { PageHero, SectionHead, CTAButton } from '../components/common';
import AboutSection from '../sections/AboutSection';
import CoachesSection from '../sections/CoachesSection';
import { brandValues, coachingPillars } from '../content/approach';
import { siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function About() {
  usePageMeta('About Us', 'The ACSES story: an assessment-led, coaching-first studio built on strength, discipline and measurable progress.');
  return (
    <>
      <PageHero
        eyebrow="About ACSES"
        title={
          <>
            A soul of <em>healthy body</em> and wellness
          </>
        }
        lede="ACSES Fitness Studio is a premium athletic performance studio where every programme is led by coaches and built on how you move."
        image="/images/coach-assessment.jpg"
      />

      <section className="section">
        <div className="container about-mission">
          <SectionHead
            eyebrow="Our mission"
            title={
              <>
                Coaching that <em>respects</em> the body
              </>
            }
          />
          <div className="about-mission__body reveal">
            <p className="lede">
              We believe lasting fitness is built, not rushed. That means understanding each person before prescribing training, coaching every
              session with care, and measuring progress honestly over time.
            </p>
            <p className="muted">
              Our coaching team develops across a structured pathway — from anatomy and physiology to programming and performance — so the person
              guiding your session understands the why behind every movement.
            </p>
            <ul className="pillars" aria-label="Coaching development pathway">
              {coachingPillars.map((p, i) => (
                <li key={p}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <AboutSection withLink={false} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Values" title={<>What we <em>stand</em> for</>} />
          <div className="grid grid--3">
            {brandValues.map((v, i) => (
              <div key={v.title} className="card reveal value-card" style={{ ['--reveal-delay' as string]: `${(i % 3) * 80}ms` }}>
                <span className="value-card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.title}</h3>
                <p className="muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface section--tight">
        <div className="container safety reveal">
          <ShieldCheck size={40} strokeWidth={1.4} aria-hidden="true" />
          <div>
            <h2 className="h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Safety comes <em>first</em>
            </h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Training is progressed at a pace that suits you, technique is coached before load is added, and coaches adapt sessions to how you
              feel on the day. If you have a medical condition or injury, please speak with a qualified health professional and let the team know
              before starting.
            </p>
          </div>
        </div>
      </section>

      <section className="section about-facility">
        <div className="container">
          <SectionHead eyebrow="The studio" title={<>Built for <em>performance</em></>} lede={`Our ${siteConfig.city} studio brings coaching, strength and movement under one roof.`} />
          <figure className="about-facility__fig reveal">
            <img src={asset('images/acses-promo.jpg')} alt="ACSES coaches leading strength, mobility and plyometric training sessions" loading="lazy" width={980} height={700} />
          </figure>
        </div>
      </section>

      <CoachesSection />

      <section className="section section--tight">
        <div className="container cta-band reveal">
          <h2 className="h2">
            Ready to <em>start?</em>
          </h2>
          <CTAButton to="/contact#enquire">Enquire now</CTAButton>
        </div>
      </section>
    </>
  );
}
