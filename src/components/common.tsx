import { asset } from '../lib/asset';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3 } from 'lucide-react';
import type { ReactNode } from 'react';
import { siteConfig } from '../content/siteConfig';

/** The supplied logo, untouched. `screen` blending drops its black background on dark surfaces. */
export function Logo({ size = 48, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="logo">
      <img src={siteConfig.logo} alt={withWordmark ? '' : siteConfig.name} width={size} height={size} className="logo__mark" />
      {withWordmark && (
        <span className="logo__text">
          <span className="logo__name">ACSES</span>
          <span className="logo__sub">Fitness Studio</span>
        </span>
      )}
    </span>
  );
}

interface CTAProps {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  arrow?: boolean;
  className?: string;
}

export function CTAButton({ to, children, variant = 'primary', size = 'md', arrow = true, className = '' }: CTAProps) {
  const cls = `btn btn--${variant} ${size === 'sm' ? 'btn--sm' : ''} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={18} aria-hidden="true" />}
    </>
  );
  if (/^(https?:|tel:|mailto:)/.test(to)) {
    return (
      <a href={to} className={cls} target={to.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}

export function DraftBadge({ label = 'Awaiting confirmation' }: { label?: string }) {
  return (
    <span className="draft-badge" title="Draft content — hidden in production until ACSES confirms it">
      <Clock3 size={12} aria-hidden="true" />
      {label}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  split = false,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  split?: boolean;
  aside?: ReactNode;
}) {
  return (
    <header className={`section-head ${split ? 'section-head--split' : ''}`}>
      <div style={{ display: 'grid', gap: 20 }}>
        <span className="eyebrow reveal">{eyebrow}</span>
        <h2 className="h2 reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
          {title}
        </h2>
      </div>
      {(lede || aside) && (
        <div className="reveal" style={{ ['--reveal-delay' as string]: '160ms', display: 'grid', gap: 20, justifyItems: 'start' }}>
          {lede && <p className="lede">{lede}</p>}
          {aside}
        </div>
      )}
    </header>
  );
}

/** Inner-page header band */
export function PageHero({ eyebrow, title, lede, image }: { eyebrow: string; title: ReactNode; lede?: string; image?: string }) {
  return (
    <section className="page-hero">
      {image && <img className="page-hero__img" src={asset(image)} alt="" aria-hidden="true" />}
      <div className="chevron-accent page-hero__chevron" />
      <div className="container page-hero__inner">
        <span className="eyebrow reveal">{eyebrow}</span>
        <h1 className="h1 reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
          {title}
        </h1>
        {lede && (
          <p className="lede reveal" style={{ ['--reveal-delay' as string]: '160ms' }}>
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
