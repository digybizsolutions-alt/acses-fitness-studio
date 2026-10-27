import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import { PageHero } from '../components/common';
import EnquirySection from '../sections/EnquirySection';
import { SHOW_DRAFTS, siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Contact() {
  usePageMeta('Contact & Enquiry', 'Enquire with ACSES Fitness Studio. Tell us your goals and our team will contact you.');
  const { hash } = useLocation();
  const { contact } = siteConfig;
  const showMap = (contact.verified || SHOW_DRAFTS) && contact.mapsEmbedUrl;

  useEffect(() => {
    if (hash === '#enquire') {
      requestAnimationFrame(() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [hash]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s <em>talk</em> training
          </>
        }
        lede="Send an enquiry and the ACSES team will get in touch to discuss your goals and next steps."
      />
      <EnquirySection />
      {showMap && (
        <section className="section section--tight">
          <div className="container" style={{ display: 'grid', gap: 20 }}>
            <div className="map-frame">
              <iframe
                title={`Map showing ${siteConfig.name}`}
                src={contact.mapsEmbedUrl!}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {contact.mapsUrl && (
              <a href={contact.mapsUrl} className="btn btn--ghost" target="_blank" rel="noopener noreferrer" style={{ justifySelf: 'start' }}>
                <Navigation size={18} aria-hidden="true" /> Get directions
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );
}
