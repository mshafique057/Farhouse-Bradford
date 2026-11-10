import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useSite } from '../lib/SiteContext.jsx';
import { useAsync } from '../lib/utils.js';
import { Card, Title } from './ui.jsx';

export function ModeCard() {
  const { settings, saveSettings } = useSite();
  const live = settings.mode === 'live';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const toggle = async () => {
    const q = live
      ? 'Put the website under construction? Visitors will only see the Coming Soon page.'
      : 'Make the website live? Visitors will be able to see all pages.';
    if (!window.confirm(q)) return;
    setBusy(true);
    setErr('');
    try {
      await saveSettings({ ...settings, mode: live ? 'construction' : 'live' });
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };

  return (
    <Card title="Website status">
      <div className={`mode ${live ? 'is-live' : 'is-cons'}`}>
        <div>
          <span className="dot" />
          <strong>{live ? 'Live' : 'Under construction'}</strong>
          <p>
            {live
              ? 'Everyone can see the full website.'
              : 'Visitors only see the Coming Soon page. You can still preview the full site while logged in.'}
          </p>
        </div>
        <button type="button" className={live ? 'btn-s' : 'btn-p'} onClick={toggle} disabled={busy}>
          {busy ? 'Please wait…' : live ? 'Put under construction' : 'Make site live'}
        </button>
      </div>
      {err && <div className="fld-e">{err}</div>}
    </Card>
  );
}

const count = async (table, filter) => {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: c } = await q;
  return c ?? 0;
};

export default function Overview() {
  const { data } = useAsync(async () => {
    const [newBookings, unread, posts, items, photos] = await Promise.all([
      count('bookings', (q) => q.eq('status', 'new')),
      count('messages', (q) => q.eq('is_read', false)),
      count('posts'),
      count('menu_items'),
      count('gallery'),
    ]);
    return { newBookings, unread, posts, items, photos };
  }, []);
  const d = data || {};
  const stats = [
    ['New bookings', d.newBookings, '/admin/bookings'],
    ['Unread messages', d.unread, '/admin/messages'],
    ['Menu items', d.items, '/admin/menu'],
    ['Gallery photos', d.photos, '/admin/gallery'],
    ['Blog posts', d.posts, '/admin/blog'],
  ];
  return (
    <>
      <Title sub="Manage everything on your website from here.">Overview</Title>
      <ModeCard />
      <div className="stats">
        {stats.map(([label, n, to]) => (
          <Link key={label} to={to} className="stat">
            <strong>{n ?? '–'}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
