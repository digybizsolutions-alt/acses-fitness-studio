import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { siteConfig } from '../../content/siteConfig';
import type { HeroScene } from './scene';
import './Hero3D.css';

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Lazy 3D emblem. Shows a static poster (same visual treatment, CSS-only) while
 * Three.js loads, and permanently when WebGL is unavailable or reduced motion is requested.
 */
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced || !hasWebGL()) return;
    let scene: HeroScene | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let visible = true;

    const onVisibility = () => {
      if (!scene) return;
      if (document.hidden || !visible) scene.stop();
      else scene.start();
    };
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el || !scene) return;
      const h = window.innerHeight || 1;
      scene.setScroll(Math.min(1, Math.max(0, window.scrollY / h)));
    };

    // Defer the heavy import until the browser is idle after first paint.
    const idle: (cb: () => void) => number =
      (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback?.bind(window) ??
      ((cb) => window.setTimeout(cb, 200));

    idle(() => {
      import('./scene').then(({ createHeroScene }) => {
        if (cancelled || !canvasRef.current) return;
        scene = createHeroScene({
          canvas: canvasRef.current,
          logoUrl: siteConfig.logo,
          lite: window.matchMedia('(max-width: 767px)').matches,
          onFirstFrame: () => setReady(true),
        });
        scene.start();
        onScroll();
        io = new IntersectionObserver(([en]) => {
          visible = en.isIntersecting;
          onVisibility();
        });
        if (wrapRef.current) io.observe(wrapRef.current);
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      scene?.dispose();
    };
  }, [reduced]);

  return (
    <div className={`hero3d ${ready ? 'is-ready' : ''}`} ref={wrapRef} aria-hidden="true">
      <div className="hero3d__poster">
        <div className="hero3d__poster-ring" />
        <img src={siteConfig.logo} alt="" width={150} height={150} className="hero3d__poster-logo" />
      </div>
      <canvas ref={canvasRef} className="hero3d__canvas" />
    </div>
  );
}
