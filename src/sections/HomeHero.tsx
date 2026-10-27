import { asset } from '../lib/asset';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { CTAButton } from '../components/common';
import { siteConfig } from '../content/siteConfig';
import { usePrefersReducedMotion } from '../lib/hooks';

const Hero3D = lazy(() => import('../components/Hero3D/Hero3D'));

export default function HomeHero() {
  const bg = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Subtle photo parallax
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (bg.current) bg.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
    };
  }, [reduced]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" ref={bg} aria-hidden="true">
        <img src={asset('images/coach-assessment.jpg')} alt="" width={312} height={700} />
      </div>
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      <div className="chevron-accent hero__chevron" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow hero-in" style={{ ['--d' as string]: '0ms' }}>
            <span>ACSES Fitness Studio</span>
            <span className="hero__slash">/</span>
            <span className="hero__eyebrow-tags">Performance • Strength • Wellness</span>
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__line hero-in" style={{ ['--d' as string]: '120ms' }}>
              Build strength.
            </span>
            <span className="hero__line hero-in" style={{ ['--d' as string]: '220ms' }}>
              Move better.
            </span>
            <span className="hero__line hero__line--accent hero-in" style={{ ['--d' as string]: '320ms' }}>
              Become more.
            </span>
          </h1>

          <p className="hero__lede hero-in" style={{ ['--d' as string]: '460ms' }}>
            Coaching-led training built around your goals, movement, and long-term progress.
          </p>

          <div className="hero__ctas hero-in" style={{ ['--d' as string]: '560ms' }}>
            <CTAButton to="/contact#enquire">Enquire now</CTAButton>
            <CTAButton to="/services" variant="ghost" arrow={false}>
              Explore programmes
            </CTAButton>
          </div>

          <div className="hero__slider hero-in" style={{ ['--d' as string]: '680ms' }} aria-hidden="true">
            <span className="hero__slider-line" />
            <span className="hero__slider-dot" />
          </div>
        </div>

        <div className="hero__visual">
          <Suspense fallback={<div className="hero3d" />}>
            <Hero3D />
          </Suspense>
        </div>
      </div>

      <div className="container hero__foot">
        <p className="hero__tagline">{siteConfig.tagline}</p>
        <span className="hero__scroll" aria-hidden="true">
          Scroll
          <span />
        </span>
      </div>
    </section>
  );
}
