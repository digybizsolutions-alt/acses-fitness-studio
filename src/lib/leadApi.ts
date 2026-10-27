import type { EnquiryForm } from './validation';
import { getUtm } from './utm';

export interface LeadPayload extends Omit<EnquiryForm, 'preferredContact'> {
  preferredContact: string;
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export type LeadResult = { ok: true; leadId: string } | { ok: false; message: string };

/** Public Apps Script Web App URL. Not a secret — the endpoint itself validates every request. */
const ENDPOINT = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined)?.trim() ?? '';

export const isLeadEndpointConfigured = ENDPOINT.length > 0;

export function buildPayload(form: EnquiryForm, sourcePage: string): LeadPayload {
  return {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    interestedIn: form.interestedIn,
    preferredContact: form.preferredContact,
    preferredTime: form.preferredTime,
    message: form.message.trim(),
    consent: form.consent,
    honeypot: form.honeypot,
    sourcePage,
    ...getUtm(),
  };
}

/**
 * POST to Google Apps Script.
 * Content-Type text/plain keeps this a CORS "simple request" (no preflight, which
 * Apps Script cannot answer). Apps Script replies via a 302 to googleusercontent.com,
 * which fetch follows and which allows cross-origin reads of the JSON body.
 */
export async function submitLead(payload: LeadPayload, signal?: AbortSignal): Promise<LeadResult> {
  if (!isLeadEndpointConfigured) {
    if (import.meta.env.DEV) {
      // Local demo mode: simulate a successful round-trip so the UI states can be reviewed.
      await new Promise((r) => setTimeout(r, 1100));
      const d = new Date();
      const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      return { ok: true, leadId: `ACSES-${stamp}-DEMO00` };
    }
    return { ok: false, message: 'Online enquiries are temporarily unavailable.' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal,
    });
    if (!res.ok) return { ok: false, message: 'Unable to submit enquiry.' };
    const data = (await res.json()) as Partial<LeadResult>;
    if (data.ok === true && typeof (data as { leadId?: unknown }).leadId === 'string') {
      return { ok: true, leadId: (data as { leadId: string }).leadId };
    }
    return { ok: false, message: (data as { message?: string }).message || 'Unable to submit enquiry.' };
  } catch {
    return { ok: false, message: 'Unable to submit enquiry. Please check your connection and try again.' };
  }
}
