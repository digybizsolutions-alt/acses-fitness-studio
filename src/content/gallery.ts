import type { Verifiable } from './siteConfig';

export interface GalleryItem extends Verifiable {
  id: string;
  /** Path under /public, or null for an empty slot awaiting approved media. */
  src: string | null;
  alt: string;
  caption: string;
  /** Grid shape hint */
  shape?: 'tall' | 'wide' | 'square';
  /** Source / permission note */
  source: string;
}

/**
 * Curated local gallery (preferred over live embeds for performance).
 * The two crops come from the ACSES promotional artwork supplied by the client.
 * CLIENT INPUT REQUIRED: approved, high-resolution studio / session photos.
 */
export const gallery: GalleryItem[] = [
  {
    id: 'coach-assessment',
    src: '/images/coach-assessment.jpg',
    alt: 'ACSES coach with a clipboard observing an athlete training with a kettlebell',
    caption: 'Coach-led sessions',
    shape: 'tall',
    source: 'ACSES promotional artwork',
    verified: true,
  },
  {
    id: 'track-drills',
    src: '/images/track-drills.jpg',
    alt: 'Athlete performing a hurdle mobility drill outdoors',
    caption: 'Movement & mobility drills',
    shape: 'tall',
    source: 'ACSES promotional artwork',
    verified: true,
  },
  { id: 'slot-1', src: null, alt: '', caption: 'Strength floor', shape: 'wide', source: 'Awaiting approved photo', verified: false },
  { id: 'slot-2', src: null, alt: '', caption: 'Small-group conditioning', shape: 'square', source: 'Awaiting approved photo', verified: false },
  { id: 'slot-3', src: null, alt: '', caption: 'Assessment', shape: 'square', source: 'Awaiting approved photo', verified: false },
  { id: 'slot-4', src: null, alt: '', caption: 'Studio community', shape: 'wide', source: 'Awaiting approved photo', verified: false },
  { id: 'slot-5', src: null, alt: '', caption: 'Equipment', shape: 'square', source: 'Awaiting approved photo', verified: false },
  { id: 'slot-6', src: null, alt: '', caption: 'Performance testing', shape: 'square', source: 'Awaiting approved photo', verified: false },
];
