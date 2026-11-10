import { useSite } from '../lib/SiteContext.jsx';
import PageHead from '../components/PageHead.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';

export default function Contact() {
  const { pages, contact } = useSite().settings;
  const p = pages.contact;
  const info = [
    ['Phone', contact.phone],
    ['Email', contact.email],
    ['Address', contact.address],
    ['Opening hours', contact.hours],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight split">
        <div>
          {info.length > 0 && (
            <dl className="info-list">
              {info.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className="pre">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {contact.mapUrl && (
            <iframe className="map" title="Map" src={contact.mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          )}
        </div>
        <EnquiryForm type="contact" />
      </section>
    </>
  );
}
