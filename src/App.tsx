import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout as AppLayout } from './AppLayout.tsx';
import { Home } from './pages/Home.tsx';
import Loader from './components/Loader.tsx';
import LiveAnnouncer from './components/Accessibility/LiveAnnouncer.tsx';

// Lazy-load non-home pages so the initial bundle stays small.
// Home, AppLayout, Navbar, and Footer are eagerly loaded — they are
// needed on every visit and contain the critical emergency contacts.
const About = lazy(() => import('./pages/About.tsx'));
const Resources = lazy(() => import('./pages/Resources.tsx'));
const Support = lazy(() => import('./pages/Support.tsx'));
const EventsPage = lazy(() => import('./pages/Events.tsx'));
const Blogs = lazy(() => import('./pages/Blogs.tsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'));
const SurveysResult = lazy(() => import('./pages/SurveysResult.tsx'));
const Competitions = lazy(() => import('./pages/Competitions.tsx'));
const ICC = lazy(() => import('./pages/ICC.tsx'));

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home page',
  '/about': 'About page',
  '/events': 'Events page',
  '/competitions': 'Competitions page',
  '/blogs': 'Blogs page',
  '/surveys': 'Surveys and Results page',
  '/support': 'Support page',
  '/icc': 'ICC page',
  '/resources': 'Resources page',
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the artificial loader on initial page load — let React render
    // immediately so content is visible as fast as possible.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const isPathChange = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    // Only show loader on actual page-to-page navigation
    if (!isPathChange) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Announce route change to screen readers
      const pageName = PAGE_NAMES[location.pathname] ?? 'New page';
      setAnnouncement('');
      setTimeout(() => {
        setAnnouncement(`Navigated to ${pageName}`);
      }, 50);

      // Move focus to main content area for keyboard/screen reader users
      const main = document.getElementById('main-content');
      if (main) {
        main.focus({ preventScroll: true });
      }

      // Scroll to top unless navigating to a hash target
      if (!location.hash) {
        window.scrollTo(0, 0);
      }
    }, 500);
  }, [location]);

  return (
    <>
      {/* Screen reader route change announcements — always in DOM */}
      <LiveAnnouncer message={announcement} />

      {loading && <Loader />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path='/support' element={<Support />} />
            <Route path='/events' element={<EventsPage />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blogs/:id' element={<BlogPost />} />
            <Route path='/surveys' element={<SurveysResult />} />
            <Route path='/competitions' element={<Competitions />} />
            <Route path='/icc' element={<ICC />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

const AppWrapper = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default AppWrapper;
