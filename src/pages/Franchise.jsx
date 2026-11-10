import { useSite } from '../lib/SiteContext.jsx';
import PageHead from '../components/PageHead.jsx';
import Rich from '../components/Rich.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';

export default function Franchise() {
  const p = useSite().settings.pages.franchise;
  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight">
        {(p.body || p.image) && (
          <div className={`split${p.image ? '' : ' single'}`}>
            <Rich text={p.body} />
            {p.image && <img className="rounded" src={p.image} alt="" />}
          </div>
        )}
        <div className="narrow form-block">
          <h2 className="section-title">Franchise enquiry</h2>
          <EnquiryForm type="franchise" subjectLabel="City / area you are interested in" />
        </div>
      </section>
    </>
  );
}
