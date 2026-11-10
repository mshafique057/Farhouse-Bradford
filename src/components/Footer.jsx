import { Link } from 'react-router-dom';
import { useSite } from '../lib/SiteContext.jsx';

const SOCIAL = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['tiktok', 'TikTok'],
  ['x', 'X'],
  ['youtube', 'YouTube'],
];

export default function Footer({ minimal = false }) {
  const { settings } = useSite();
  const { footer, contact, brand } = settings;
  const social = SOCIAL.filter(([k]) => footer.social[k]);
  const hasContact = footer.showContact && (contact.phone || contact.email || contact.address);
  const showTop = !minimal && (footer.about || footer.links.length > 0 || hasContact || social.length > 0);

  return (
    <footer className="site-footer">
      {showTop && (
        <div className="container footer-grid">
          <div>
            <div className="footer-title">{brand.name}</div>
            {footer.about && <p className="footer-text">{footer.about}</p>}
          </div>
          {footer.links.length > 0 && (
            <div>
              <div className="footer-title">Links</div>
              <ul className="footer-list">
                {footer.links.map((l, i) => (
                  <li key={i}>
                    {/^https?:/.test(l.path) ? (
                      <a href={l.path} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.path}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasContact && (
            <div>
              <div className="footer-title">Contact</div>
              <ul className="footer-list">
                {contact.phone && <li>{contact.phone}</li>}
                {contact.email && <li>{contact.email}</li>}
                {contact.address && <li className="pre">{contact.address}</li>}
              </ul>
            </div>
          )}
          {social.length > 0 && (
            <div>
              <div className="footer-title">Follow us</div>
              <ul className="footer-list">
                {social.map(([k, label]) => (
                  <li key={k}>
                    <a href={footer.social[k]} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="container footer-bottom">{footer.copyright}</div>
    </footer>
  );
}
