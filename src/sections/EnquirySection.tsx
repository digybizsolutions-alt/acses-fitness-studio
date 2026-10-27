import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm/EnquiryForm';
import { DraftBadge } from '../components/common';
import { phoneHref, siteConfig, SHOW_DRAFTS, whatsappHref } from '../content/siteConfig';

export default function EnquirySection({ showDetails = true }: { showDetails?: boolean }) {
  const { contact } = siteConfig;
  const visible = contact.verified || SHOW_DRAFTS;
  const tel = phoneHref();
  const wa = whatsappHref();

  return (
    <section className="section enquiry" id="enquire" aria-labelledby="enquire-title">
      <div className="chevron-accent enquiry__chevron" aria-hidden="true" />
      <div className="container enquiry__inner">
        <div className="enquiry__intro">
          <span className="eyebrow reveal">Start here</span>
          <h2 id="enquire-title" className="h2 reveal">
            Your next rep <em>starts here</em>
          </h2>
          <p className="lede reveal">
            Tell us a little about your goals and the ACSES team will get in touch to talk through the right programme for you.
          </p>

          {showDetails && (
            <ul className="enquiry__details reveal">
              {visible && contact.address && (
                <li>
                  <MapPin size={20} aria-hidden="true" />
                  <span>{contact.address}</span>
                </li>
              )}
              {tel && (
                <li>
                  <Phone size={20} aria-hidden="true" />
                  <a href={tel}>{contact.phone}</a>
                </li>
              )}
              {wa && (
                <li>
                  <MessageCircle size={20} aria-hidden="true" />
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </a>
                </li>
              )}
              {visible && contact.hours && (
                <li>
                  <Clock size={20} aria-hidden="true" />
                  <span>
                    {contact.hours.map((h) => (
                      <span key={h.days} style={{ display: 'block' }}>
                        {h.days}: {h.time}
                      </span>
                    ))}
                  </span>
                </li>
              )}
              {SHOW_DRAFTS && !contact.verified && (
                <li>
                  <DraftBadge label="Address, phone, WhatsApp & hours pending" />
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="enquiry__card reveal">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
