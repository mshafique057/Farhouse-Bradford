import { useSettingsEditor } from './hooks.js';
import { Card, SaveBar, Text, Area, Title, Toggle } from './ui.jsx';

const SOCIAL = [
  ['facebook', 'Facebook link'],
  ['instagram', 'Instagram link'],
  ['tiktok', 'TikTok link'],
  ['x', 'X (Twitter) link'],
  ['youtube', 'YouTube link'],
];

export default function FooterEditor() {
  const { draft, set, save, saving, dirty, msg } = useSettingsEditor();
  const f = draft.footer;
  return (
    <>
      <Title sub="Text, links and social media shown at the bottom of every page.">Footer</Title>
      <Card title="Footer text">
        <Area label="About text" rows={3} value={f.about} onChange={(v) => set('footer.about', v)} />
        <Text label="Copyright line" value={f.copyright} onChange={(v) => set('footer.copyright', v)} />
        <Toggle
          label="Show phone, email and address in the footer"
          hint="Details come from General & Branding. Empty fields are not shown."
          checked={f.showContact}
          onChange={(v) => set('footer.showContact', v)}
        />
      </Card>

      <Card
        title="Footer links"
        actions={
          <button type="button" className="btn-s" onClick={() => set('footer.links', [...f.links, { label: '', path: '/' }])}>
            + Add link
          </button>
        }
      >
        {f.links.length === 0 && <p className="fld-h">No links yet.</p>}
        <div className="rows">
          {f.links.map((l, i) => (
            <div className="row-item" key={i}>
              <div className="row-fields">
                <Text label="Label" value={l.label} onChange={(v) => set(`footer.links.${i}.label`, v)} />
                <Text label="Link" value={l.path} onChange={(v) => set(`footer.links.${i}.path`, v)} />
              </div>
              <div className="row-btns">
                <button type="button" className="btn-s danger" onClick={() => set('footer.links', f.links.filter((_, k) => k !== i))}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Social media">
        <p className="fld-h">Paste the full page link. Empty ones are hidden.</p>
        <div className="grid2">
          {SOCIAL.map(([k, label]) => (
            <Text key={k} label={label} value={f.social[k]} onChange={(v) => set(`footer.social.${k}`, v)} placeholder="https://" />
          ))}
        </div>
      </Card>
      <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} />
    </>
  );
}
