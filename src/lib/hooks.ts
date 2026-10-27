import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../content/siteConfig';

/** Per-page <title>, meta description, canonical and og:url. */
export function usePageMeta(title: string, description: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title === siteConfig.name ? `${siteConfig.name} | ${siteConfig.positioning}` : `${title} | ${siteConfig.name}`;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', document.title);
    setMeta('property', 'og:description', description);
    if (siteConfig.siteUrl) {
      const url = siteConfig.siteUrl + pathname;
      setMeta('property', 'og:url', url);
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  }, [title, description, pathname]);
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Adds `is-visible` to `.reveal` elements inside the returned ref once they scroll into view. */
export function useRevealAll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pending = () => Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      pending().forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    pending().forEach((el) => io.observe(el));
    // Pick up content that mounts later (lazy sections, conditional blocks).
    const mo = new MutationObserver(() => pending().forEach((el) => io.observe(el)));
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return ref;
}
