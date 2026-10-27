import type { Verifiable } from './siteConfig';

export type ServiceIcon = 'dumbbell' | 'user' | 'activity' | 'move' | 'apple' | 'stethoscope';

export interface Service extends Verifiable {
  id: string;
  title: string;
  icon: ServiceIcon;
  summary: string;
  /** Longer description used on the Services page. */
  detail: string;
  focus: string[];
  /** Internal note on what ACSES must confirm. Never rendered in production. */
  confirmNote: string;
}

/**
 * Candidate services from requirements §7. ALL are `verified: false` until ACSES
 * confirms the current offer. Copy uses non-guaranteed, evidence-informed language.
 */
export const services: Service[] = [
  {
    id: 'strength-conditioning',
    title: 'Strength & Conditioning',
    icon: 'dumbbell',
    summary: 'Build strength, movement quality and performance with structured coaching.',
    detail:
      'Progressive, periodised training that develops strength, power and work capacity — coached rep by rep so technique keeps pace with the load.',
    focus: ['Progressive programming', 'Technique coaching', 'Power & capacity'],
    confirmNote: 'Likely; confirm exact offer.',
    verified: false,
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    icon: 'user',
    summary: 'Individual coaching tailored to your goals, ability and training history.',
    detail:
      'One-to-one sessions built around an initial assessment, with a plan that adapts as you progress and a coach who knows your history.',
    focus: ['1:1 coaching', 'Individual assessment', 'Adaptive plan'],
    confirmNote: 'Confirm delivery and packages.',
    verified: false,
  },
  {
    id: 'functional-fitness',
    title: 'Functional Fitness',
    icon: 'activity',
    summary: 'Train movement patterns, coordination, work capacity and everyday performance.',
    detail:
      'Sessions built on fundamental movement patterns — push, pull, hinge, squat, carry and rotate — to support everyday performance.',
    focus: ['Movement patterns', 'Coordination', 'Work capacity'],
    confirmNote: 'Confirm current programme.',
    verified: false,
  },
  {
    id: 'mobility-movement',
    title: 'Mobility & Movement',
    icon: 'move',
    summary: 'Improve movement confidence and work on individual movement limitations.',
    detail:
      'Targeted mobility and control work informed by how you move, helping you train with more range and confidence.',
    focus: ['Movement screening', 'Range & control', 'Training readiness'],
    confirmNote: 'Confirm scope and claims.',
    verified: false,
  },
  {
    id: 'nutrition-guidance',
    title: 'Nutrition Guidance',
    icon: 'apple',
    summary: 'Practical nutrition education aligned to your training goals.',
    detail:
      'Practical, sustainable nutrition education that supports your training — habits and understanding, not crash diets.',
    focus: ['Habit-based approach', 'Training-aligned', 'Practical education'],
    confirmNote: 'Confirm qualifications and scope.',
    verified: false,
  },
  {
    id: 'physio-pain-management',
    title: 'Physiotherapy & Pain Management',
    icon: 'stethoscope',
    summary: 'Assessment-led support for mobility, rehabilitation and return to activity.',
    detail:
      'Where appropriate, qualified professionals collaborate with coaches to support rehabilitation and a structured return to training.',
    focus: ['Assessment-led', 'Coach–physio collaboration', 'Return to activity'],
    confirmNote: 'Publish only if currently offered by qualified staff; avoid diagnosis/guarantees.',
    verified: false,
  },
];
