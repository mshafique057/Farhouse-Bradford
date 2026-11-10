import { useState } from 'react';
import { NavLink, Routes, Route, Navigate, Link } from 'react-router-dom';
import '../styles/admin.css';
import { useSite } from '../lib/SiteContext.jsx';
import { isConfigured, supabase } from '../lib/supabase.js';
import Login from './Login.jsx';
import Overview from './Overview.jsx';
import ModePage from './ModePage.jsx';
import General from './General.jsx';
import Navigation from './Navigation.jsx';
import FooterEditor from './FooterEditor.jsx';
import PagesEditor from './PagesEditor.jsx';
import MenuManager from './MenuManager.jsx';
import GalleryManager from './GalleryManager.jsx';
import BlogManager from './BlogManager.jsx';
import Bookings from './Bookings.jsx';
import Messages from './Messages.jsx';
import Account from './Account.jsx';

const LINKS = [
  ['', 'Overview'],
  ['mode', 'Site Mode'],
  ['general', 'General & Branding'],
  ['header', 'Header & Menu'],
  ['footer', 'Footer'],
  ['pages', 'Pages Content'],
  ['menu', 'Menu Items'],
  ['gallery', 'Gallery'],
  ['blog', 'Blog'],
  ['bookings', 'Bookings'],
  ['messages', 'Messages'],
  ['account', 'Account'],
];

function Setup() {
  return (
    <div className="adm login-wrap">
      <div className="login-box">
        <h1>Database not connected</h1>
        <p>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env</code> file (and
          in Vercel &gt; Settings &gt; Environment Variables), then redeploy. See README.md for the full guide.
        </p>
        <Link to="/">← Back to website</Link>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const { session, authReady, loading, settings } = useSite();
  const [open, setOpen] = useState(false);

  if (!isConfigured) return <Setup />;
  if (!authReady || loading) return <div className="adm login-wrap">Loading…</div>;
  if (!session) return <Login />;

  return (
    <div className="adm shell">
      <header className="topbar">
        <button type="button" className="burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          ☰
        </button>
        <strong>{settings.brand.fullName} – Admin</strong>
      </header>
      <aside className={`side${open ? ' open' : ''}`}>
        <div className="side-brand">Admin Dashboard</div>
        <nav onClick={() => setOpen(false)}>
          {LINKS.map(([path, label]) => (
            <NavLink key={path} to={`/admin${path ? `/${path}` : ''}`} end={path === ''}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
          <button type="button" onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="mode" element={<ModePage />} />
          <Route path="general" element={<General />} />
          <Route path="header" element={<Navigation />} />
          <Route path="footer" element={<FooterEditor />} />
          <Route path="pages" element={<PagesEditor />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
