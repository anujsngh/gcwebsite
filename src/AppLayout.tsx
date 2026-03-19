import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import LinksSection from './components/Sections/LinksSection';
import SkipLinks from './components/Accessibility/SkipLinks';
import BackToTop from './components/Common/BackToTop';

export const Layout = () => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  // Show LinksSection on all pages except individual blog posts
  const showLinksSection = !location.pathname.startsWith('/blogs/');

  // Measure navbar height and expose as CSS variable for hero centering
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      document.documentElement.style.setProperty('--navbar-h', `${nav.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content grain-page">
        {/* Skip links — must be the first focusable elements in the DOM */}
        <SkipLinks />

        {/* Sticky navigation header */}
        <div ref={navRef} id="site-navigation" className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>

        {/* Main content — tabIndex={-1} allows programmatic focus on route change */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="flex-grow outline-none pb-8"
        >
          <Outlet />
        </main>

        {showLinksSection && <LinksSection />}
        <Footer />
      </div>

      {/* Fixed UI outside grain-page so CSS filter doesn't break position:fixed */}
      <BackToTop />
    </>
  );
};
