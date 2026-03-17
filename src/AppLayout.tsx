import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import LinksSection from './components/Sections/LinksSection';
import SkipLinks from './components/Accessibility/SkipLinks';
import AccessibilityToolbar from './components/Accessibility/AccessibilityToolbar';

export const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  // Show LinksSection on all pages except individual blog posts
  const showLinksSection = !location.pathname.startsWith('/blogs/');

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Skip links — must be the first focusable elements in the DOM */}
      <SkipLinks />

      {/* Sticky navigation header */}
      <div id="site-navigation" className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>

      {/* Main content — tabIndex={-1} allows programmatic focus on route change */}
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className={`flex-grow outline-none${isHomePage ? '' : ' py-8'}`}
      >
        <Outlet />
      </main>

      {showLinksSection && <LinksSection />}
      <Footer />

      {/* Accessibility toolbar — fixed position, always visible */}
      <AccessibilityToolbar />
    </div>
  );
};
