import { Instagram } from 'lucide-react';
import { PageHero } from '../components/common';
import GalleryGrid from '../components/GalleryGrid/GalleryGrid';
import EnquirySection from '../sections/EnquirySection';
import { siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Gallery() {
  usePageMeta('Gallery', 'Inside ACSES Fitness Studio — coaching, training sessions, equipment and community.');
  const ig = siteConfig.socials.find((s) => s.id === 'instagram');
  const igUrl = ig?.verified && ig.url ? ig.url : null;
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Inside the <em>studio</em>
          </>
        }
        lede="Coaching, sessions and the community that trains with us."
      />
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 40 }}>
          <GalleryGrid />
          {igUrl && (
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ justifySelf: 'start' }}>
              <Instagram size={18} aria-hidden="true" /> Follow {ig!.handle}
            </a>
          )}
        </div>
      </section>
      <EnquirySection showDetails={false} />
    </>
  );
}
