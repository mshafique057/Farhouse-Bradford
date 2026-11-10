import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { SiteProvider, useSite } from './lib/SiteContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ComingSoon from './components/ComingSoon.jsx';
import Wheat from './components/Wheat.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Menu from './pages/Menu.jsx';
import Gallery from './pages/Gallery.jsx';
import Booking from './pages/Booking.jsx';
import Franchise from './pages/Franchise.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';

// Admin dashboard alag chunk mein load hota hai (public site halki rehti hai)
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function PublicLayout() {
  const { settings, loading, session, authReady } = useSite();
  if (loading || !authReady) {
    return (
      <div className="splash">
        <Wheat size={64} />
      </div>
    );
  }
  const construction = settings.mode !== 'live';
  // Under construction mein visitors ko sirf Coming Soon nazar aata hai.
  // Logged-in admin poori site preview kar sakta hai.
  if (construction && !session) return <ComingSoon />;
  return (
    <div className="site">
      {construction && (
        <div className="preview-bar">
          Preview: site is under construction, only you can see these pages.{' '}
          <Link to="/admin/mode">Change site mode</Link>
        </div>
      )}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="container page-head">
      <h1>Page not found</h1>
      <p>
        <Link to="/" className="btn">
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="splash" />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="menu" element={<Menu />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="booking" element={<Booking />} />
            <Route path="franchise" element={<Franchise />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SiteProvider>
    </BrowserRouter>
  );
}
