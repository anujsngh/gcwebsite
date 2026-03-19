import { useState, useEffect, useRef } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout as AppLayout } from './AppLayout.tsx';
import { Home } from './pages/Home.tsx';
import Resources from './pages/Resources.tsx';
import About from './pages/About.tsx';
import Loader from './components/Loader.tsx';
import Support from './pages/Support.tsx';
import EventsPage from './pages/Events.tsx';
import SurveysResult from './pages/SurveysResult.tsx';
import ICC from './pages/ICC.tsx';
import Blogs from './pages/Blogs.tsx';
import BlogPost from './pages/BlogPost.tsx';
import Competitions from './pages/Competitions.tsx';
import LiveAnnouncer from './components/Accessibility/LiveAnnouncer.tsx';

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
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const isPathChange = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

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

      // Only scroll to top on actual navigation between pages (not on refresh).
      // Hash scrolling is handled by LinkCard/HomeCard after navigation.
      if (isPathChange && !location.hash) {
        window.scrollTo(0, 0);
      }
    }, 500);
  }, [location]);

  return (
    <>
      {/* Screen reader route change announcements — always in DOM */}
      <LiveAnnouncer message={announcement} />

      {loading && <Loader />}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path='/support' element={<Support />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blogs/:id' element={<BlogPost />} />
          {/* <Route path="/contact" element={<ContactUs />} /> */}
          <Route path='/surveys' element={<SurveysResult />} />
          <Route path='/competitions' element={<Competitions />} />
          <Route path='/icc' element={<ICC />} />
        </Route>
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default AppWrapper;
