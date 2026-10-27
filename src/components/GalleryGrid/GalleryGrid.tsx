import { asset } from '../../lib/asset';
import { ImageIcon } from 'lucide-react';
import { gallery } from '../../content/gallery';
import { isPublishable, SHOW_DRAFTS } from '../../content/siteConfig';
import './GalleryGrid.css';

export default function GalleryGrid({ limit }: { limit?: number }) {
  const items = gallery.filter((g) => g.src ? isPublishable(g) : SHOW_DRAFTS).slice(0, limit);
  return (
    <ul className="gallery-grid">
      {items.map((g, i) => (
        <li
          key={g.id}
          className={`gallery-grid__item gallery-grid__item--${g.shape ?? 'square'} reveal`}
          style={{ ['--reveal-delay' as string]: `${(i % 4) * 70}ms` }}
        >
          {g.src ? (
            <figure>
              <img src={asset(g.src)} alt={g.alt} loading="lazy" decoding="async" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ) : (
            <div className="gallery-grid__slot">
              <ImageIcon size={28} strokeWidth={1.4} aria-hidden="true" />
              <span className="gallery-grid__slot-title">{g.caption}</span>
              <span className="draft-badge">Approved photo needed</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
