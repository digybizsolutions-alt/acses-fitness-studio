import { services } from '../content/services';
import { isPublishable } from '../content/siteConfig';

export type ContactMethod = 'Phone' | 'WhatsApp' | 'Email';

export interface EnquiryForm {
  fullName: string;
  phone: string;
  email: string;
  interestedIn: string;
  preferredContact: ContactMethod | '';
  preferredTime: string;
  message: string;
  consent: boolean;
  honeypot: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryForm, string>>;

export const LIMITS = {
  fullName: 80,
  phone: 20,
  email: 120,
  message: 1000,
} as const;

export const NOT_SURE = 'Not sure yet';

export function interestOptions(): string[] {
  return [...services.filter(isPublishable).map((s) => s.title), NOT_SURE];
}

export const contactMethods: ContactMethod[] = ['Phone', 'WhatsApp', 'Email'];

export const preferredTimes = ['Morning (6am – 10am)', 'Midday (10am – 2pm)', 'Afternoon (2pm – 6pm)', 'Evening (6pm – 9pm)', 'Any time'];

export const emptyEnquiry: EnquiryForm = {
  fullName: '',
  phone: '',
  email: '',
  interestedIn: '',
  preferredContact: '',
  preferredTime: '',
  message: '',
  consent: false,
  honeypot: '',
};

/** Indian mobile (+91 optional, starts 6–9, 10 digits) or international E.164-ish. */
export function isValidPhone(raw: string): boolean {
  const v = raw.replace(/[\s\-().]/g, '');
  if (/^(\+91|91|0)?[6-9]\d{9}$/.test(v)) return true;
  return /^\+[1-9]\d{7,14}$/.test(v);
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function validateEnquiry(f: EnquiryForm): EnquiryErrors {
  const e: EnquiryErrors = {};
  const name = f.fullName.trim();
  if (!name) e.fullName = 'Please enter your full name.';
  else if (name.length < 2) e.fullName = 'Name looks too short.';
  else if (name.length > LIMITS.fullName) e.fullName = `Please keep your name under ${LIMITS.fullName} characters.`;

  if (!f.phone.trim()) e.phone = 'Please enter a phone or WhatsApp number.';
  else if (!isValidPhone(f.phone)) e.phone = 'Enter a valid Indian mobile number (e.g. 98765 43210) or international format (+44…).';

  const email = f.email.trim();
  if (f.preferredContact === 'Email' && !email) e.email = 'Please add an email address to be contacted by email.';
  else if (email && (!isValidEmail(email) || email.length > LIMITS.email)) e.email = 'Please enter a valid email address.';

  if (!f.interestedIn) e.interestedIn = 'Please choose what you are interested in.';
  else if (!interestOptions().includes(f.interestedIn)) e.interestedIn = 'Please choose an option from the list.';

  if (!f.preferredContact) e.preferredContact = 'Please choose how we should contact you.';

  if (f.message.length > LIMITS.message) e.message = `Please keep your message under ${LIMITS.message} characters.`;

  if (!f.consent) e.consent = 'Please confirm you agree to be contacted about this enquiry.';
  return e;
}
