import { useSite } from '../lib/SiteContext.jsx';
import PageHead from '../components/PageHead.jsx';
import Rich from '../components/Rich.jsx';

export default function About() {
  const p = useSite().settings.pages.about;
  return (
    <>
      <PageHead title={p.title} />
      <section className="container section-tight">
        <div className={`split${p.image ? '' : ' single'}`}>
          <Rich text={p.body} />
          {p.image && <img className="rounded" src={p.image} alt="" />}
        </div>
        {!p.body && !p.image && <p className="empty">This page will be updated soon.</p>}
      </section>
    </>
  );
}
