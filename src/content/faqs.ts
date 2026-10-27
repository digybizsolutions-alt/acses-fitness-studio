import type { Verifiable } from './siteConfig';

export interface Faq extends Verifiable {
  id: string;
  question: string;
  answer: string;
}

/** Draft answers — ACSES must approve each before setting verified: true. */
export const faqs: Faq[] = [
  {
    id: 'suitability',
    question: 'Is ACSES suitable for beginners?',
    answer:
      'Our approach is coaching-led, so training starts from where you are today. Tell us about your experience and goals in the enquiry form and the team will advise on the right starting point.',
    verified: false,
  },
  {
    id: 'first-visit',
    question: 'What happens on my first visit?',
    answer:
      'Your first visit is a chance to discuss your goals, training history and how you move, so the coaching team can recommend a programme. Details are confirmed when the team contacts you.',
    verified: false,
  },
  {
    id: 'programmes',
    question: 'Which programmes do you offer?',
    answer:
      'See the Services page for current programmes. If you are not sure which is right for you, choose “Not sure yet” in the enquiry form.',
    verified: false,
  },
  {
    id: 'pricing',
    question: 'How much does training cost?',
    answer:
      'Pricing depends on the programme and format. Send an enquiry and the ACSES team will share current options with you directly.',
    verified: false,
  },
  {
    id: 'appointments',
    question: 'How do I book an appointment?',
    answer:
      'Submit the enquiry form with your preferred contact method and time. The ACSES team will contact you to arrange your visit.',
    verified: false,
  },
];
