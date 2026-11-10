import { useSettingsEditor } from './hooks.js';
import { Card, SaveBar, Text, Area, Title } from './ui.jsx';
import { ModeCard } from './Overview.jsx';

export default function ModePage() {
  const { draft, set, save, saving, dirty, msg } = useSettingsEditor();
  const c = draft.construction;
  return (
    <>
      <Title sub="Choose whether visitors see the full website or the Coming Soon page.">Site Mode</Title>
      <ModeCard />
      <Card title="Coming Soon page text">
        <Text label="Small tag" value={c.tag} onChange={(v) => set('construction.tag', v)} />
        <Text label="Headline" value={c.headline} onChange={(v) => set('construction.headline', v)} />
        <Area label="Text" value={c.text} onChange={(v) => set('construction.text', v)} />
        <p className="fld-h">
          Colours, logo and menu bar of this page come from the General and Header settings.{' '}
          <a href="/" target="_blank" rel="noreferrer">
            Preview website ↗
          </a>
        </p>
      </Card>
      <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} />
    </>
  );
}
