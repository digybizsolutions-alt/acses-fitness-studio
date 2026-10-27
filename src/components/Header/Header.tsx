import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navItems } from '../../content/siteConfig';
import { CTAButton, Logo } from '../common';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a, button'));
        const [a, b] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled || open ? 'is-solid' : ''}`}>
        <div className="container site-header__inner">
          <Link to="/" className="site-header__brand" aria-label="ACSES Fitness Studio — home">
            <Logo size={44} />
          </Link>

          <nav className="site-nav" aria-label="Main">
            <ul>
              {navItems.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <CTAButton to="/contact#enquire" size="sm" arrow={false} className="site-header__cta">
            Enquire now
          </CTAButton>

          <button
            ref={menuBtn}
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <div id="mobile-nav" ref={panel} className={`mobile-nav ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((n, i) => (
              <li key={n.to} style={{ ['--i' as string]: i }}>
                <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}>
                  <span className="mobile-nav__num">0{i + 1}</span>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <CTAButton to="/contact#enquire">Enquire now</CTAButton>
      </div>

      {/* Persistent but unobtrusive mobile enquiry CTA */}
      {!pathname.startsWith('/contact') && (
        <Link to="/contact#enquire" className={`mobile-cta ${scrolled && !open ? 'is-visible' : ''}`}>
          Enquire now
        </Link>
      )}
    </>
  );
}
