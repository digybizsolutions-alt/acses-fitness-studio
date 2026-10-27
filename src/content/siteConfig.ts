import { asset } from '../lib/asset';

/**
 * Central business configuration.
 *
 * RULE: never invent business facts. Every value that has not been supplied and
 * confirmed by ACSES stays `null` (or `verified: false`). Unverified values are
 * only rendered — with a visible "Awaiting confirmation" badge — when draft mode
 * is on (VITE_SHOW_DRAFTS=true). In production with draft mode off they are hidden.
 */

export interface Verifiable {
  /** true only once ACSES has confirmed this item in writing. */
  verified: boolean;
}

export interface SocialLink extends Verifiable {
  id: 'instagram' | 'linkedin' | 'google';
  label: string;
  handle: string;
  /** Exact official URL supplied by ACSES. Leave null until supplied. */
  url: string | null;
}

export const SHOW_DRAFTS = import.meta.env.VITE_SHOW_DRAFTS === 'true';

export const siteConfig = {
  name: 'ACSES Fitness Studio',
  shortName: 'ACSES',
  tagline: 'A Soul of Healthy body and Wellness',
  positioning: 'Premium Athletic Performance',
  city: 'Chennai',
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '',
  logo: asset('acses-logo.png'),

  /** Trial CTA is shown only if ACSES confirms a trial is available. */
  trialAvailable: false,

  contact: {
    // CLIENT INPUT REQUIRED — leave null until verified.
    address: null as string | null,
    phone: null as string | null, // E.164, e.g. "+9198XXXXXXXX"
    whatsapp: null as string | null, // E.164 digits for wa.me links
    email: null as string | null,
    mapsUrl: null as string | null, // Verified Google Business Profile / Maps URL
    mapsEmbedUrl: null as string | null,
    hours: null as { days: string; time: string }[] | null,
    verified: false,
  },

  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@acsesfitness', url: null, verified: false },
    { id: 'linkedin', label: 'LinkedIn', handle: 'ACSES Fitness Studio', url: null, verified: false },
    { id: 'google', label: 'Google Business Profile', handle: 'ACSES Fitness Studio', url: null, verified: false },
  ] satisfies SocialLink[] as SocialLink[],

  privacy: {
    // CLIENT INPUT REQUIRED — contact route for privacy / deletion requests and retention period.
    contactEmail: null as string | null,
    retentionMonths: null as number | null,
    lastUpdated: '27 October 2026',
  },
};

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/coaches', label: 'Coaches' },
  { to: '/results', label: 'Results & Reviews' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function isPublishable(item: Verifiable): boolean {
  return item.verified || SHOW_DRAFTS;
}

export function publishedSocials(): SocialLink[] {
  // A social link needs a real URL to be clickable at all.
  return siteConfig.socials.filter((s) => s.url && isPublishable(s));
}

export function whatsappHref(): string | null {
  const { whatsapp, verified } = siteConfig.contact;
  if (!whatsapp || !(verified || SHOW_DRAFTS)) return null;
  return `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`;
}

export function phoneHref(): string | null {
  const { phone, verified } = siteConfig.contact;
  if (!phone || !(verified || SHOW_DRAFTS)) return null;
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
