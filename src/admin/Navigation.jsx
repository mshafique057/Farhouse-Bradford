import { useSettingsEditor } from './hooks.js';
import { Card, SaveBar, Text, Title, Toggle } from './ui.jsx';

export default function Navigation() {
  const { draft, set, save, saving, dirty, msg } = useSettingsEditor();
  const nav = draft.header.nav;
  const cta = draft.header.cta;

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= nav.length) return;
    const next = [...nav];
    [next[i], next[j]] = [next[j], next[i]];
    set('header.nav', next);
  };

  return (
    <>
      <Title sub="Choose which menu items appear, rename them and change their order.">Header &amp; Menu</Title>
      <Card
        title="Menu bar"
        actions={
          <button type="button" className="btn-s" onClick={() => set('header.nav', [...nav, { label: 'New link', path: '/', visible: true }])}>
            + Add link
          </button>
        }
      >
        <div className="rows">
          {nav.map((item, i) => (
            <div className="row-item" key={i}>
              <div className="row-fields">
                <Text label="Label" value={item.label} onChange={(v) => set(`header.nav.${i}.label`, v)} />
                <Text label="Link" value={item.path} onChange={(v) => set(`header.nav.${i}.path`, v)} />
              </div>
              <Toggle label="Show" checked={item.visible} onChange={(v) => set(`header.nav.${i}.visible`, v)} />
              <div className="row-btns">
                <button type="button" className="btn-s ghost" onClick={() => move(i, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="btn-s ghost" onClick={() => move(i, 1)} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="btn-s danger" onClick={() => set('header.nav', nav.filter((_, k) => k !== i))}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="fld-h">
          Page links: / (home), /about, /menu, /gallery, /booking, /franchise, /contact, /blog. Full links like https://… also work.
        </p>
      </Card>

      <Card title="Header button">
        <Toggle label="Show a button in the header" checked={cta.show} onChange={(v) => set('header.cta.show', v)} />
        <div className="grid2">
          <Text label="Button text" value={cta.label} onChange={(v) => set('header.cta.label', v)} />
          <Text label="Button link" value={cta.path} onChange={(v) => set('header.cta.path', v)} />
        </div>
      </Card>
      <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} />
    </>
  );
}
