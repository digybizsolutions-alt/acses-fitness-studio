import { PageHero, SectionHead } from '../components/common';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import EnquirySection from '../sections/EnquirySection';
import FAQSection from '../sections/FAQSection';
import { services } from '../content/services';
import { isPublishable } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Services() {
  usePageMeta('Services & Programmes', 'Coach-led programmes at ACSES Fitness Studio: strength & conditioning, personal training, functional fitness, mobility and more.');
  const list = services.filter(isPublishable);
  return (
    <>
      <PageHero
        eyebrow="Services & programmes"
        title={
          <>
            Programmes built <em>around you</em>
          </>
        }
        lede="Every programme starts with an assessment and is coached with intent. Choose a focus — or tell us your goal and we'll recommend one."
        image="/images/track-drills.jpg"
      />
      <section className="section">
        <div className="container">
          {list.length > 0 ? (
            <div className="grid grid--3">
              {list.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} detailed />
              ))}
            </div>
          ) : (
            <SectionHead eyebrow="Programmes" title="Programme details coming soon" lede="Send an enquiry and the ACSES team will talk you through current options." />
          )}
          <p className="muted reveal" style={{ marginTop: 40, fontSize: '0.85rem', maxWidth: '75ch' }}>
            Individual results vary. Our programmes are designed to support your goals through structured, evidence-informed coaching — they are not
            a substitute for medical advice, diagnosis or treatment.
          </p>
        </div>
      </section>
      <FAQSection />
      <EnquirySection showDetails={false} />
    </>
  );
}
