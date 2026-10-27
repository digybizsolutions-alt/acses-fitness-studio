import type { Verifiable } from './siteConfig';

export interface Coach extends Verifiable {
  id: string;
  name: string;
  role: string;
  /** Approved qualifications only — never fabricate credentials. */
  qualifications: string[];
  specialties: string[];
  bio: string;
  /** Approved portrait path under /public. null shows a neutral placeholder. */
  photo: string | null;
}

/**
 * CLIENT INPUT REQUIRED — team names, bios, qualifications and approved portraits.
 * The entries below are structural placeholders only and are hidden in production
 * (verified: false). Replace them with real, approved profiles.
 */
export const coaches: Coach[] = [
  {
    id: 'coach-1',
    name: 'Coach name',
    role: 'Head Coach',
    qualifications: [],
    specialties: ['Strength & Conditioning', 'Assessment'],
    bio: 'Approved coach biography to be supplied by ACSES.',
    photo: null,
    verified: false,
  },
  {
    id: 'coach-2',
    name: 'Coach name',
    role: 'Performance Coach',
    qualifications: [],
    specialties: ['Functional Fitness', 'Mobility'],
    bio: 'Approved coach biography to be supplied by ACSES.',
    photo: null,
    verified: false,
  },
  {
    id: 'coach-3',
    name: 'Specialist name',
    role: 'Physiotherapy / Rehab (if offered)',
    qualifications: [],
    specialties: ['Return to activity'],
    bio: 'Approved specialist biography to be supplied by ACSES.',
    photo: null,
    verified: false,
  },
];
