import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { slugify } from '../lib/utils.js';
import { fmtDateTime, useRows } from './hooks.js';
import { Area, Card, ImageField, Text, Title, Toggle } from './ui.jsx';

const ORDER = [['created_at', false]];

function PostForm({ post, onDone }) {
  const [f, setF] = useState({ title: '', slug: '', excerpt: '', content: '', cover_url: '', published: false, ...post });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    const slug = slugify(f.slug || f.title);
    if (!slug) return setErr('Please add a title.');
    setBusy(true);
    setErr('');
    const row = {
      title: f.title.trim(),
      slug,
      excerpt: f.excerpt?.trim() || null,
      content: f.content || null,
      cover_url: f.cover_url || null,
      published: f.published,
    };
    const q = f.id ? supabase.from('posts').update(row).eq('id', f.id) : supabase.from('posts').insert(row);
    const { error } = await q;
    setBusy(false);
    if (error) return setErr(error.code === '23505' ? 'This link name is already used by another post.' : error.message);
    onDone();
  };

  return (
    <Card title={f.id ? 'Edit post' : 'New post'}>
      <form onSubmit={save}>
        <Text label="Title" required value={f.title} onChange={set('title')} />
        <Text label="Link name" hint={`Page link: /blog/${slugify(f.slug || f.title) || '…'}`} value={f.slug} onChange={set('slug')} placeholder="Leave empty to create from title" />
        <Area label="Short summary" rows={2} value={f.excerpt} onChange={set('excerpt')} />
        <ImageField label="Cover image" value={f.cover_url} onChange={set('cover_url')} />
        <Area label="Content" rows={14} hint='Leave a blank line for a new paragraph. Start a line with "## " for a heading.' value={f.content} onChange={set('content')} />
        <Toggle label="Published" hint="Turn off to keep it as a draft." checked={f.published} onChange={set('published')} />
        {err && <div className="fld-e">{err}</div>}
        <div className="btn-row">
          <button className="btn-p" disabled={busy}>
            {busy ? 'Saving…' : 'Save post'}
          </button>
          <button type="button" className="btn-s ghost" onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}

export default function BlogManager() {
  const { rows, loading, error, reload } = useRows('posts', ORDER);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    const { error: ex } = await supabase.from('posts').delete().eq('id', p.id);
    if (ex) setErr(ex.message);
    reload();
  };

  if (editing) {
    return (
      <>
        <Title>Blog</Title>
        <PostForm
          post={editing}
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      </>
    );
  }
  return (
    <>
      <Title sub="Write posts, save them as drafts or publish them.">Blog</Title>
      {(err || error) && <div className="fld-e">{err || error}</div>}
      <Card
        title={`Posts (${rows.length})`}
        actions={
          <button type="button" className="btn-p" onClick={() => setEditing({})}>
            + New post
          </button>
        }
      >
        {!loading && rows.length === 0 && <p className="fld-h">No posts yet.</p>}
        <p className="fld-h">The Blog link is hidden in the header by default. Turn it on from Header &amp; Menu when you are ready.</p>
        <div className="rows">
          {rows.map((p) => (
            <div className="row-item" key={p.id}>
              {p.cover_url ? <img className="thumb" src={p.cover_url} alt="" /> : <div className="thumb ph" />}
              <div className="row-grow">
                <strong>{p.title}</strong>{' '}
                <span className={`badge ${p.published ? 'ok' : ''}`}>{p.published ? 'Published' : 'Draft'}</span>
                <div className="dim">{fmtDateTime(p.created_at)}</div>
              </div>
              <div className="row-btns">
                <button type="button" className="btn-s" onClick={() => setEditing(p)}>
                  Edit
                </button>
                <button type="button" className="btn-s danger" onClick={() => remove(p)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
