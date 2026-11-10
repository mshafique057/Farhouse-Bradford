import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { deleteImageByUrl } from '../lib/utils.js';
import { useRows } from './hooks.js';
import { Area, Card, ImageField, Text, Title, Toggle } from './ui.jsx';

const ORDER = [
  ['sort', true],
  ['id', true],
];

function ItemForm({ item, categories, onDone }) {
  const [f, setF] = useState({ name: '', category_id: '', price: '', description: '', image_url: '', available: true, sort: 0, ...item });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const row = {
      name: f.name.trim(),
      category_id: f.category_id ? Number(f.category_id) : null,
      price: f.price?.trim() || null,
      description: f.description?.trim() || null,
      image_url: f.image_url || null,
      available: f.available,
      sort: Number(f.sort) || 0,
    };
    const q = f.id ? supabase.from('menu_items').update(row).eq('id', f.id) : supabase.from('menu_items').insert(row);
    const { error } = await q;
    setBusy(false);
    if (error) return setErr(error.message);
    onDone();
  };

  return (
    <Card title={f.id ? 'Edit item' : 'New item'}>
      <form onSubmit={save}>
        <Text label="Name" required value={f.name} onChange={set('name')} />
        <div className="grid2">
          <Text label="Price" hint="Write it as you want it shown, e.g. £9.99" value={f.price} onChange={set('price')} />
          <label className="fld">
            <span className="fld-l">Category</span>
            <select value={f.category_id ?? ''} onChange={(e) => set('category_id')(e.target.value)}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Area label="Description" rows={3} value={f.description} onChange={set('description')} />
        <ImageField label="Photo" value={f.image_url} onChange={set('image_url')} />
        <div className="grid2">
          <Text label="Order (small number shows first)" type="number" value={f.sort} onChange={set('sort')} />
          <Toggle label="Available (shown on website)" checked={f.available} onChange={set('available')} />
        </div>
        {err && <div className="fld-e">{err}</div>}
        <div className="btn-row">
          <button className="btn-p" disabled={busy}>
            {busy ? 'Saving…' : 'Save item'}
          </button>
          <button type="button" className="btn-s ghost" onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}

export default function MenuManager() {
  const cats = useRows('menu_categories', ORDER);
  const items = useRows('menu_items', ORDER);
  const [editing, setEditing] = useState(null);
  const [newCat, setNewCat] = useState('');
  const [err, setErr] = useState('');

  const run = async (q) => {
    const { error } = await q;
    if (error) setErr(error.message);
    else setErr('');
    cats.reload();
    items.reload();
  };
  const catName = (id) => cats.rows.find((c) => c.id === id)?.name || 'No category';

  return (
    <>
      <Title sub="Add categories and dishes. Changes appear on the website straight away.">Menu Items</Title>
      {(err || cats.error || items.error) && <div className="fld-e">{err || cats.error || items.error}</div>}

      <Card title="Categories">
        <div className="rows">
          {cats.rows.map((c) => (
            <div className="row-item" key={`${c.id}-${c.name}-${c.sort}`}>
              <div className="row-fields">
                <label className="fld">
                  <span className="fld-l">Name</span>
                  <input defaultValue={c.name} onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && run(supabase.from('menu_categories').update({ name: e.target.value.trim() }).eq('id', c.id))} />
                </label>
                <label className="fld">
                  <span className="fld-l">Order</span>
                  <input type="number" defaultValue={c.sort} onBlur={(e) => Number(e.target.value) !== c.sort && run(supabase.from('menu_categories').update({ sort: Number(e.target.value) || 0 }).eq('id', c.id))} />
                </label>
              </div>
              <div className="row-btns">
                <button
                  type="button"
                  className="btn-s danger"
                  onClick={() => window.confirm('Delete this category? Its items stay, but without a category.') && run(supabase.from('menu_categories').delete().eq('id', c.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <form
          className="inline-add"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newCat.trim()) return;
            run(supabase.from('menu_categories').insert({ name: newCat.trim(), sort: cats.rows.length + 1 }));
            setNewCat('');
          }}
        >
          <input placeholder="New category name" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          <button className="btn-s">+ Add category</button>
        </form>
      </Card>

      {editing ? (
        <ItemForm
          item={editing}
          categories={cats.rows}
          onDone={() => {
            setEditing(null);
            items.reload();
          }}
        />
      ) : (
        <Card
          title={`Items (${items.rows.length})`}
          actions={
            <button type="button" className="btn-p" onClick={() => setEditing({})}>
              + Add item
            </button>
          }
        >
          {items.rows.length === 0 && !items.loading && <p className="fld-h">No items yet.</p>}
          <div className="rows">
            {items.rows.map((it) => (
              <div className="row-item" key={it.id}>
                {it.image_url ? <img className="thumb" src={it.image_url} alt="" /> : <div className="thumb ph" />}
                <div className="row-grow">
                  <strong>{it.name}</strong> {it.price && <span className="dim">· {it.price}</span>}
                  <div className="dim">
                    {catName(it.category_id)} {!it.available && <span className="badge">Hidden</span>}
                  </div>
                </div>
                <div className="row-btns">
                  <button type="button" className="btn-s" onClick={() => setEditing(it)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-s danger"
                    onClick={async () => {
                      if (!window.confirm(`Delete "${it.name}"?`)) return;
                      await run(supabase.from('menu_items').delete().eq('id', it.id));
                      deleteImageByUrl(it.image_url).catch(() => {});
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
