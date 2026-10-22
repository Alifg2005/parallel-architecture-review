import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

/** Scroll to the hash target if there is one, otherwise to the top, on every navigation. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait a frame so the target page has rendered.
      const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-contrast focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
