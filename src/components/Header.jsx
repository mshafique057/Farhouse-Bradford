import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../lib/SiteContext.jsx';
import Wheat from './Wheat.jsx';

// inert = Coming Soon page par: links sab "/" par jate hain
export default function Header({ inert = false }) {
  const { settings } = useSite();
  const { brand, header } = settings;
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const items = header.nav.filter((i) => i.visible);
  const isActive = (p) => (inert ? p === '/' : p === '/' ? pathname === '/' : pathname.startsWith(p));

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          {brand.logoUrl ? <img className="brand-logo" src={brand.logoUrl} alt={brand.fullName} /> : <Wheat size={42} />}
          {(brand.showText || !brand.logoUrl) && (
            <span>
              <span className="brand-name">{brand.name}</span>
              {brand.subtitle && <span className="brand-sub">{brand.subtitle}</span>}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={open ? 'M5 5l14 14M19 5L5 19' : 'M4 7h16M4 12h16M4 17h16'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        <nav id="main-nav" aria-label="Main" className={`main-nav${open ? ' is-open' : ''}`}>
          {items.map((item, i) => (
            <Link
              key={`${item.path}-${i}`}
              to={inert ? '/' : item.path}
              className={isActive(item.path) ? 'is-active' : ''}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          {header.cta.show && !inert && (
            <Link to={header.cta.path} className="btn btn-small nav-cta">
              {header.cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
