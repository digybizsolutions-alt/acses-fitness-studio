import { ExternalLink } from 'lucide-react';
import { PageHero } from '../components/common';
import ResultsSection from '../sections/ResultsSection';
import EnquirySection from '../sections/EnquirySection';
import { siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Results() {
  usePageMeta('Results & Reviews', 'What members value at ACSES Fitness Studio — coaching, personal plans and progress you can see.');
  const gbp = siteConfig.socials.find((s) => s.id === 'google');
  const gbpUrl = gbp?.verified && gbp.url ? gbp.url : null;
  return (
    <>
      <PageHero
        eyebrow="Results & reviews"
        title={
          <>
            Progress, <em>honestly</em> measured
          </>
        }
        lede="We share real stories only with members' written permission. Everyone's journey is different — and that's exactly why we coach individually."
        image="/images/track-drills.jpg"
      />
      <ResultsSection />
      {gbpUrl && (
        <section className="section section--tight">
          <div className="container cta-band reveal">
            <h2 className="h2">
              Read our <em>Google reviews</em>
            </h2>
            <a className="btn btn--ghost" href={gbpUrl} target="_blank" rel="noopener noreferrer">
              View on Google <ExternalLink size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      )}
      <section className="section section--tight">
        <div className="container">
          <p className="muted reveal" style={{ fontSize: '0.85rem', maxWidth: '75ch' }}>
            Any member stories shown on this site are shared with written consent. Results vary between individuals and depend on many factors;
            no specific outcome or timeline is guaranteed.
          </p>
        </div>
      </section>
      <EnquirySection showDetails={false} />
    </>
  );
}
