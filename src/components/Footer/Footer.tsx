import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { navItems, phoneHref, publishedSocials, siteConfig, whatsappHref, SHOW_DRAFTS } from '../../content/siteConfig';
import { DraftBadge, Logo } from '../common';
import './Footer.css';

const socialIcon = { instagram: Instagram, linkedin: Linkedin, google: MapPin } as const;

export default function Footer() {
  const { contact } = siteConfig;
  const showContact = contact.verified || SHOW_DRAFTS;
  const tel = phoneHref();
  const wa = whatsappHref();
  const socials = publishedSocials();
  const hasAnyContact = showContact && (contact.address || tel || wa || contact.email);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo size={64} />
            <p className="site-footer__tagline">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="site-footer__h">Explore</h2>
            <ul className="site-footer__list">
              {navItems.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="site-footer__h">Visit &amp; contact</h2>
            {hasAnyContact ? (
              <ul className="site-footer__list site-footer__contact">
                {contact.address && (
                  <li>
                    <MapPin size={16} aria-hidden="true" />
                    {contact.mapsUrl ? (
                      <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                        {contact.address}
                      </a>
                    ) : (
                      contact.address
                    )}
                  </li>
                )}
                {tel && (
                  <li>
                    <Phone size={16} aria-hidden="true" />
                    <a href={tel}>{contact.phone}</a>
                  </li>
                )}
                {wa && (
                  <li>
                    <MessageCircle size={16} aria-hidden="true" />
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      WhatsApp us
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <Mail size={16} aria-hidden="true" />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
              </ul>
            ) : (
              <div className="site-footer__pending">
                <p className="muted">
                  {siteConfig.city}. Send an enquiry and the ACSES team will get in touch.
                </p>
                {SHOW_DRAFTS && <DraftBadge label="Address, phone & hours pending" />}
              </div>
            )}
            <Link to="/contact#enquire" className="text-link" style={{ marginTop: 20 }}>
              Make an enquiry
            </Link>
          </div>

          <div>
            <h2 className="site-footer__h">Follow</h2>
            {socials.length > 0 ? (
              <ul className="site-footer__social">
                {socials.map((s) => {
                  const Icon = socialIcon[s.id];
                  return (
                    <li key={s.id}>
                      <a href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={`${siteConfig.name} on ${s.label} (opens in a new tab)`}>
                        <Icon size={20} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="site-footer__pending">
                <p className="muted">Instagram · LinkedIn · Google</p>
                {SHOW_DRAFTS && <DraftBadge label="Official URLs pending" />}
              </div>
            )}
          </div>
        </div>

        <hr className="rule" />
        <div className="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="site-footer__pos">{siteConfig.positioning}</p>
        </div>
      </div>
    </footer>
  );
}
