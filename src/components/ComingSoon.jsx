import { useSite } from '../lib/SiteContext.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function ComingSoon() {
  const { settings } = useSite();
  const { construction: c, brand } = settings;
  return (
    <div className="site">
      <Header inert />
      <main className="container cs-hero">
        <div>
          {c.tag && <span className="tag">{c.tag}</span>}
          <h1>{c.headline}</h1>
          {c.text && <p>{c.text}</p>}
        </div>
        <div className="sign" role="img" aria-label="Coming soon sign">
          <div className="sign-top">{brand.fullName.replace(/ restaurant$/i, '').toUpperCase()}</div>
          <div className="sign-main">Coming Soon</div>
          <div className="sign-rule" />
        </div>
      </main>
      <Footer minimal />
    </div>
  );
}
