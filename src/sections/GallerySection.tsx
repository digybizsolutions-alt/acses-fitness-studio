import { Instagram } from 'lucide-react';
import GalleryGrid from '../components/GalleryGrid/GalleryGrid';
import { CTAButton, SectionHead } from '../components/common';
import { siteConfig } from '../content/siteConfig';

export default function GallerySection() {
  const ig = siteConfig.socials.find((s) => s.id === 'instagram');
  const igUrl = ig?.verified && ig.url ? ig.url : null;
  return (
    <section className="section section--surface" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead
          split
          eyebrow="Inside the studio"
          title={
            <span id="gallery-title">
              Where the <em>work</em> happens
            </span>
          }
          aside={
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTAButton to="/gallery" variant="ghost" size="sm">
                View gallery
              </CTAButton>
              {igUrl && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
                  <Instagram size={18} aria-hidden="true" /> {ig!.handle}
                </a>
              )}
            </div>
          }
        />
        <GalleryGrid limit={5} />
      </div>
    </section>
  );
}
