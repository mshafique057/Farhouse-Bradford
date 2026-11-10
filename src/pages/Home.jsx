import { Link } from 'react-router-dom';
import { useSite } from '../lib/SiteContext.jsx';
import { useAsync } from '../lib/utils.js';
import { getMenu, getGallery, getPosts } from '../lib/api.js';
import Wheat from '../components/Wheat.jsx';
import Rich from '../components/Rich.jsx';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Home() {
  const { settings } = useSite();
  const h = settings.pages.home;
  const { brand, pages } = settings;
  const menu = useAsync(getMenu, []).data;
  const photos = useAsync(() => getGallery(6), []).data;
  const posts = useAsync(() => getPosts(3), []).data;
  const items = (menu?.items || []).slice(0, 6);

  return (
    <>
      <section className="container hero">
        <div className="hero-text">
          <h1>{h.heroTitle || brand.fullName}</h1>
          {h.heroText && <p className="lead pre">{h.heroText}</p>}
          <div className="hero-actions">
            {h.heroButtonLabel && (
              <Link to={h.heroButtonPath || '/menu'} className="btn">
                {h.heroButtonLabel}
              </Link>
            )}
            {pages.booking.enabled && (
              <Link to="/booking" className="btn btn-outline">
                Book a table
              </Link>
            )}
          </div>
        </div>
        {h.heroImage ? (
          <img className="hero-img" src={h.heroImage} alt="" />
        ) : (
          <div className="hero-deco" aria-hidden="true">
            <Wheat size={220} />
          </div>
        )}
      </section>

      {(h.aboutTitle || h.aboutText) && (
        <section className="section alt">
          <div className={`container split${h.aboutImage ? '' : ' single'}`}>
            <div>
              {h.aboutTitle && <h2 className="section-title">{h.aboutTitle}</h2>}
              <Rich text={h.aboutText} />
              <Link to="/about" className="text-link">
                Read more
              </Link>
            </div>
            {h.aboutImage && <img className="rounded" src={h.aboutImage} alt="" loading="lazy" />}
          </div>
        </section>
      )}

      {h.showMenuPreview && items.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">From our menu</h2>
            <div className="menu-grid">
              {items.map((it) => (
                <MenuCard key={it.id} item={it} />
              ))}
            </div>
            <p className="center">
              <Link to="/menu" className="btn btn-outline">
                View full menu
              </Link>
            </p>
          </div>
        </section>
      )}

      {h.showGalleryPreview && photos?.length > 0 && (
        <section className="section alt">
          <div className="container">
            <h2 className="section-title">Gallery</h2>
            <div className="gallery-grid">
              {photos.map((p) => (
                <img key={p.id} src={p.image_url} alt={p.caption || ''} loading="lazy" />
              ))}
            </div>
            <p className="center">
              <Link to="/gallery" className="btn btn-outline">
                See all photos
              </Link>
            </p>
          </div>
        </section>
      )}

      {h.showBlogPreview && posts?.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Latest from the blog</h2>
            <div className="post-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function MenuCard({ item }) {
  return (
    <article className="menu-card">
      {item.image_url && <img src={item.image_url} alt="" loading="lazy" />}
      <div className="menu-card-body">
        <div className="menu-card-top">
          <h3>{item.name}</h3>
          {item.price && <span className="price">{item.price}</span>}
        </div>
        {item.description && <p className="pre">{item.description}</p>}
      </div>
    </article>
  );
}

export function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="post-card">
      {post.cover_url && <img src={post.cover_url} alt="" loading="lazy" />}
      <div className="post-card-body">
        <time>{fmtDate(post.created_at)}</time>
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
      </div>
    </Link>
  );
}

export { fmtDate };
