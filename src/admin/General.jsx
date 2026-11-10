import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { useSettingsEditor } from './hooks.js';
import { Card, Color, ImageField, SaveBar, Text, Area, Title, Toggle } from './ui.jsx';

export default function General() {
  const { draft, set, save, saving, dirty, msg } = useSettingsEditor();
  const { brand, theme, contact, seo } = draft;
  return (
    <>
      <Title sub="Logo, name, colours, contact details and SEO.">General &amp; Branding</Title>

      <Card title="Brand">
        <Text label="Short name (shown in header)" value={brand.name} onChange={(v) => set('brand.name', v)} />
        <Text label="Small line under the name" value={brand.subtitle} onChange={(v) => set('brand.subtitle', v)} />
        <Text label="Full business name" value={brand.fullName} onChange={(v) => set('brand.fullName', v)} />
        <ImageField
          label="Logo"
          value={brand.logoUrl}
          onChange={(v) => set('brand.logoUrl', v)}
          hint="PNG with transparent background works best. If empty, the wheat icon is used."
        />
        <Toggle
          label="Show name text next to the logo"
          hint="Turn off if your logo image already contains the name."
          checked={brand.showText}
          onChange={(v) => set('brand.showText', v)}
        />
      </Card>

      <Card
        title="Colours"
        actions={
          <button type="button" className="btn-s ghost" onClick={() => set('theme', DEFAULT_SETTINGS.theme)}>
            Reset colours
          </button>
        }
      >
        <div className="grid2">
          <Color label="Main colour (buttons, links)" value={theme.primary} onChange={(v) => set('theme.primary', v)} />
          <Color label="Second colour" value={theme.secondary} onChange={(v) => set('theme.secondary', v)} />
          <Color label="Accent colour" value={theme.accent} onChange={(v) => set('theme.accent', v)} />
          <Color label="Page background" value={theme.background} onChange={(v) => set('theme.background', v)} />
          <Color label="Text colour" value={theme.text} onChange={(v) => set('theme.text', v)} />
        </div>
      </Card>

      <Card title="Business details">
        <p className="fld-h">Only the fields you fill are shown on the website (Contact page and footer).</p>
        <div className="grid2">
          <Text label="Phone" value={contact.phone} onChange={(v) => set('contact.phone', v)} />
          <Text label="Email" value={contact.email} onChange={(v) => set('contact.email', v)} />
        </div>
        <Area label="Address" rows={3} value={contact.address} onChange={(v) => set('contact.address', v)} />
        <Area
          label="Opening hours"
          rows={4}
          value={contact.hours}
          onChange={(v) => set('contact.hours', v)}
          hint="One line per day or range, for example: Mon–Fri 12:00–22:00"
        />
        <Text
          label="Google Maps embed link"
          value={contact.mapUrl}
          onChange={(v) => set('contact.mapUrl', v)}
          hint="Google Maps > Share > Embed a map > copy only the link inside src=&quot;…&quot;"
        />
      </Card>

      <Card title="SEO (Google)">
        <Text label="Website title" value={seo.title} onChange={(v) => set('seo.title', v)} />
        <Area label="Description" rows={3} value={seo.description} onChange={(v) => set('seo.description', v)} />
      </Card>
      <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} />
    </>
  );
}
