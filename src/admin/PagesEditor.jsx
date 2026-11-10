import { useState } from 'react';
import { useSettingsEditor } from './hooks.js';
import { Area, Card, ImageField, SaveBar, Text, Title, Toggle } from './ui.jsx';

const RICH = 'Leave a blank line for a new paragraph. Start a line with "## " for a heading.';

// [key, label, type, hint]
const PAGES = {
  home: {
    label: 'Home',
    fields: [
      ['heroTitle', 'Main heading', 'text', 'If empty, the business name is shown.'],
      ['heroText', 'Text under heading', 'area'],
      ['heroImage', 'Hero image', 'image'],
      ['heroButtonLabel', 'Button text', 'text', 'Leave empty to hide the button.'],
      ['heroButtonPath', 'Button link', 'text'],
      ['aboutTitle', 'About section heading', 'text', 'Section shows only if heading or text is filled.'],
      ['aboutText', 'About section text', 'area', RICH],
      ['aboutImage', 'About section image', 'image'],
      ['showMenuPreview', 'Show menu items on home page', 'toggle'],
      ['showGalleryPreview', 'Show gallery photos on home page', 'toggle'],
      ['showBlogPreview', 'Show latest blog posts on home page', 'toggle'],
    ],
  },
  about: {
    label: 'About Us',
    fields: [
      ['title', 'Page title', 'text'],
      ['body', 'Content', 'area', RICH],
      ['image', 'Image', 'image'],
    ],
  },
  menu: {
    label: 'Menu',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area'],
      ['note', 'Note at the bottom (allergies, prices etc.)', 'area'],
    ],
  },
  gallery: {
    label: 'Gallery',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area'],
    ],
  },
  booking: {
    label: 'Booking',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area'],
      ['enabled', 'Accept online booking requests', 'toggle'],
      ['successMessage', 'Message shown after booking', 'area'],
    ],
  },
  franchise: {
    label: 'Franchise',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area'],
      ['body', 'Content', 'area', RICH],
      ['image', 'Image', 'image'],
    ],
  },
  contact: {
    label: 'Contact Us',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area', 'Phone, email, address and hours are set in General & Branding.'],
    ],
  },
  blog: {
    label: 'Blog',
    fields: [
      ['title', 'Page title', 'text'],
      ['intro', 'Intro text', 'area'],
    ],
  },
};

export default function PagesEditor() {
  const { draft, set, save, saving, dirty, msg } = useSettingsEditor();
  const [tab, setTab] = useState('home');
  const page = PAGES[tab];

  return (
    <>
      <Title sub="Edit the text and images of each page. Empty fields are simply not shown.">Pages Content</Title>
      <div className="tabs">
        {Object.entries(PAGES).map(([k, p]) => (
          <button key={k} type="button" className={k === tab ? 'on' : ''} onClick={() => setTab(k)}>
            {p.label}
          </button>
        ))}
      </div>
      <Card title={page.label}>
        {page.fields.map(([key, label, type, hint]) => {
          const path = `pages.${tab}.${key}`;
          const value = draft.pages[tab][key];
          if (type === 'image') return <ImageField key={path} label={label} hint={hint} value={value} onChange={(v) => set(path, v)} />;
          if (type === 'toggle') return <Toggle key={path} label={label} hint={hint} checked={value} onChange={(v) => set(path, v)} />;
          if (type === 'area') return <Area key={path} label={label} hint={hint} rows={hint === RICH ? 8 : 3} value={value} onChange={(v) => set(path, v)} />;
          return <Text key={path} label={label} hint={hint} value={value} onChange={(v) => set(path, v)} />;
        })}
      </Card>
      <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} />
    </>
  );
}
