import type { Verifiable } from './siteConfig';

export type TestimonialSource = 'google' | 'instagram' | 'direct';

export interface Testimonial extends Verifiable {
  id: string;
  quote: string;
  /** Name or initials exactly as publicly displayed / consented. */
  displayName: string;
  source: TestimonialSource;
  date?: string;
  /** Link back to the original review where possible (required for Google). */
  sourceUrl?: string;
  /** Written permission on file for this quote. */
  consentOnFile: boolean;
}

/**
 * Approved, real testimonials only. Empty until ACSES supplies verified content.
 * While empty, the site shows the neutral "What members value" principles instead.
 * Testimonials are NEVER shown as drafts — fake social proof must not appear even in preview.
 */
export const testimonials: Testimonial[] = [];

export function publishedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.verified && t.consentOnFile && (t.source !== 'google' || !!t.sourceUrl));
}

/** Neutral studio principles — approved-style statements, not member quotes. */
export const memberValues = [
  {
    title: 'Coaching, not just a gym floor',
    text: 'Sessions led by coaches who watch how you move and adjust the plan in real time.',
  },
  {
    title: 'A plan that starts with you',
    text: 'Training built around your goals, your history and how your body moves today.',
  },
  {
    title: 'Progress you can see',
    text: 'Regular reviews so you understand what is improving and what comes next.',
  },
  {
    title: 'Long-term, sustainable results',
    text: 'Evidence-informed training aimed at lasting strength and wellness — no shortcuts, no gimmicks.',
  },
];
