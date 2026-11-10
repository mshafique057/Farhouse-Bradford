import { useSite } from '../lib/SiteContext.jsx';
import { useAsync } from '../lib/utils.js';
import { getMenu } from '../lib/api.js';
import PageHead from '../components/PageHead.jsx';
import { MenuCard } from './Home.jsx';

export default function Menu() {
  const p = useSite().settings.pages.menu;
  const { data, loading } = useAsync(getMenu, []);
  const items = data?.items || [];
  const groups = (data?.categories || [])
    .map((c) => ({ ...c, items: items.filter((i) => i.category_id === c.id) }))
    .filter((g) => g.items.length);
  const loose = items.filter((i) => !(data?.categories || []).some((c) => c.id === i.category_id));
  if (loose.length) groups.push({ id: 'more', name: groups.length ? 'More' : '', items: loose });

  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight">
        {groups.map((g) => (
          <div key={g.id} className="menu-group">
            {g.name && <h2 className="section-title">{g.name}</h2>}
            <div className="menu-grid">
              {g.items.map((it) => (
                <MenuCard key={it.id} item={it} />
              ))}
            </div>
          </div>
        ))}
        {!loading && groups.length === 0 && <p className="empty">Our menu will be added soon.</p>}
        {p.note && <p className="note pre">{p.note}</p>}
      </section>
    </>
  );
}
