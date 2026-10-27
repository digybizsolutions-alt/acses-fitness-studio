import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  contactMethods,
  emptyEnquiry,
  interestOptions,
  LIMITS,
  preferredTimes,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryForm as Form,
} from '../../lib/validation';
import { buildPayload, submitLead } from '../../lib/leadApi';
import { phoneHref, whatsappHref } from '../../content/siteConfig';
import './EnquiryForm.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const fieldOrder: (keyof Form)[] = ['fullName', 'phone', 'email', 'interestedIn', 'preferredContact', 'preferredTime', 'message', 'consent'];

export default function EnquiryForm() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const options = interestOptions();

  const [form, setForm] = useState<Form>(() => {
    const pre = params.get('interest');
    return { ...emptyEnquiry, interestedIn: pre && options.includes(pre) ? pre : '' };
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pre = params.get('interest');
    if (pre && options.includes(pre)) setForm((f) => ({ ...f, interestedIn: pre }));
  }, [params]);

  useEffect(() => {
    if (status === 'success' || status === 'error') statusRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validateEnquiry(next)[k] }));
      return next;
    });
  };

  const onText = (k: 'fullName' | 'phone' | 'email' | 'message' | 'interestedIn' | 'preferredTime' | 'honeypot') => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(k, e.target.value);

  const onBlur = (k: keyof Form) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validateEnquiry(form)[k] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return; // duplicate-click guard
    const errs = validateEnquiry(form);
    setErrors(errs);
    setTouched(Object.fromEntries(fieldOrder.map((k) => [k, true])));
    const firstBad = fieldOrder.find((k) => errs[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus('submitting');
    const res = await submitLead(buildPayload(form, pathname));
    inFlight.current = false;
    if (res.ok) {
      setStatus('success');
      setForm({ ...emptyEnquiry });
      setTouched({});
    } else {
      setServerMsg(res.message);
      setStatus('error');
    }
  };

  const errProps = (k: keyof Form) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': id(`${k}-err`) } : { 'aria-invalid': false as const };

  const Err = ({ k }: { k: keyof Form }) =>
    errors[k] ? (
      <p className="ef__err" id={id(`${k}-err`)}>
        <AlertCircle size={15} aria-hidden="true" /> {errors[k]}
      </p>
    ) : null;

  const tel = phoneHref();
  const wa = whatsappHref();

  if (status === 'success') {
    return (
      <div className="ef__done" ref={statusRef} tabIndex={-1} role="status">
        <CheckCircle2 size={44} aria-hidden="true" />
        <h3>Enquiry received</h3>
        <p>Thank you — your enquiry has been received. The ACSES team will contact you.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} className="ef" noValidate onSubmit={onSubmit} aria-busy={submitting}>
      {errorCount > 0 && Object.keys(touched).length >= fieldOrder.length && (
        <p className="ef__summary" role="alert">
          Please fix {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`} below.
        </p>
      )}

      <div className="ef__grid">
        <div className="ef__field">
          <label htmlFor={id('fullName')}>
            Full name <span className="ef__req" aria-hidden="true">*</span>
          </label>
          <input
            id={id('fullName')}
            data-field="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.fullName}
            value={form.fullName}
            onChange={onText('fullName')}
            onBlur={onBlur('fullName')}
            {...errProps('fullName')}
          />
          <Err k="fullName" />
        </div>

        <div className="ef__field">
          <label htmlFor={id('phone')}>
            Phone / WhatsApp <span className="ef__req" aria-hidden="true">*</span>
          </label>
          <input
            id={id('phone')}
            data-field="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={LIMITS.phone}
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={onText('phone')}
            onBlur={onBlur('phone')}
            {...errProps('phone')}
          />
          <Err k="phone" />
        </div>

        <div className="ef__field">
          <label htmlFor={id('email')}>
            Email <span className="ef__opt">(optional)</span>
          </label>
          <input
            id={id('email')}
            data-field="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={form.email}
            onChange={onText('email')}
            onBlur={onBlur('email')}
            {...errProps('email')}
          />
          <Err k="email" />
        </div>

        <div className="ef__field">
          <label htmlFor={id('interestedIn')}>
            Interested in <span className="ef__req" aria-hidden="true">*</span>
          </label>
          <select
            id={id('interestedIn')}
            data-field="interestedIn"
            required
            value={form.interestedIn}
            onChange={onText('interestedIn')}
            onBlur={onBlur('interestedIn')}
            {...errProps('interestedIn')}
          >
            <option value="">Select an option</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <Err k="interestedIn" />
        </div>

        <fieldset className="ef__field ef__field--full" {...(errors.preferredContact ? { 'aria-describedby': id('preferredContact-err') } : {})}>
          <legend>
            Preferred contact method <span className="ef__req" aria-hidden="true">*</span>
          </legend>
          <div className="ef__radios">
            {contactMethods.map((m, i) => (
              <label key={m} className={`ef__radio ${form.preferredContact === m ? 'is-checked' : ''}`}>
                <input
                  type="radio"
                  name={id('preferredContact')}
                  value={m}
                  data-field={i === 0 ? 'preferredContact' : undefined}
                  checked={form.preferredContact === m}
                  onChange={() => {
                    set('preferredContact', m);
                    setTouched((t) => ({ ...t, preferredContact: true }));
                  }}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
          <Err k="preferredContact" />
        </fieldset>

        <div className="ef__field ef__field--full">
          <label htmlFor={id('preferredTime')}>
            Preferred time to be contacted <span className="ef__opt">(optional)</span>
          </label>
          <select id={id('preferredTime')} data-field="preferredTime" value={form.preferredTime} onChange={onText('preferredTime')}>
            <option value="">No preference</option>
            {preferredTimes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="ef__field ef__field--full">
          <label htmlFor={id('message')}>
            Message / goal <span className="ef__opt">(optional)</span>
          </label>
          <textarea
            id={id('message')}
            data-field="message"
            rows={4}
            maxLength={LIMITS.message}
            placeholder="Tell us what you would like help with."
            value={form.message}
            onChange={onText('message')}
            onBlur={onBlur('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id('message-hint')} ${id('message-err')}` : id('message-hint')}
          />
          <p className="ef__hint" id={id('message-hint')}>
            Please don&apos;t include medical details here — the team will discuss anything relevant with you directly.
            <span className="ef__count">
              {form.message.length}/{LIMITS.message}
            </span>
          </p>
          <Err k="message" />
        </div>

        {/* Honeypot — hidden from people and assistive tech, must stay empty */}
        <div className="ef__hp" aria-hidden="true">
          <label htmlFor={id('company')}>Company</label>
          <input id={id('company')} type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={onText('honeypot')} />
        </div>

        <div className="ef__field ef__field--full">
          <label className={`ef__consent ${errors.consent ? 'is-invalid' : ''}`}>
            <input
              type="checkbox"
              data-field="consent"
              checked={form.consent}
              onChange={(e) => set('consent', e.target.checked)}
              {...errProps('consent')}
            />
            <span>
              I agree to ACSES Fitness Studio contacting me about this enquiry, as described in the{' '}
              <Link to="/privacy">Privacy Policy</Link>. <span className="ef__req" aria-hidden="true">*</span>
            </span>
          </label>
          <Err k="consent" />
        </div>
      </div>

      {status === 'error' && (
        <div className="ef__fail" role="alert" ref={statusRef} tabIndex={-1}>
          <AlertCircle size={20} aria-hidden="true" />
          <div>
            <strong>Your enquiry could not be sent.</strong> {serverMsg} Please try again
            {tel || wa ? (
              <>
                {' '}
                or contact us directly
                {tel && (
                  <>
                    {' '}
                    by <a href={tel}>phone</a>
                  </>
                )}
                {tel && wa && ' or'}
                {wa && (
                  <>
                    {' '}
                    on{' '}
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </>
                )}
                .
              </>
            ) : (
              ' in a few minutes.'
            )}
          </div>
        </div>
      )}

      <div className="ef__actions">
        <button type="submit" className="btn btn--primary ef__submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={18} className="ef__spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send enquiry <Send size={17} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="ef__note">
          <span className="ef__req">*</span> Required fields
        </p>
      </div>
      <div className="sr-only" aria-live="polite">
        {submitting ? 'Sending your enquiry…' : ''}
      </div>
    </form>
  );
}
