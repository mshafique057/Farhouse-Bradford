import { useEffect, useState } from 'react';
import { useSite } from '../lib/SiteContext.jsx';
import { useAsync } from '../lib/utils.js';
import { getGallery } from '../lib/api.js';
import PageHead from '../components/PageHead.jsx';

export default function Gallery() {
  const p = useSite().settings.pages.gallery;
  const { data, loading } = useAsync(() => getGallery(), []);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight">
        <div className="gallery-grid">
          {(data || []).map((ph) => (
            <button key={ph.id} type="button" className="gallery-btn" onClick={() => setOpen(ph)} aria-label="Open photo">
              <img src={ph.image_url} alt={ph.caption || ''} loading="lazy" />
            </button>
          ))}
        </div>
        {!loading && !data?.length && <p className="empty">Photos will be added soon.</p>}
      </section>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button type="button" className="lightbox-close" aria-label="Close">
            ×
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={open.image_url} alt={open.caption || ''} />
            {open.caption && <figcaption>{open.caption}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}
