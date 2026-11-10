import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { deleteImageByUrl, uploadImage } from '../lib/utils.js';
import { useRows } from './hooks.js';
import { Card, Title } from './ui.jsx';

const ORDER = [['created_at', false]];

export default function GalleryManager() {
  const { rows, loading, error, reload } = useRows('gallery', ORDER);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');

  const upload = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    setErr('');
    for (let i = 0; i < files.length; i += 1) {
      setBusy(`Uploading ${i + 1} of ${files.length}…`);
      try {
        const url = await uploadImage(files[i]);
        const { error: ex } = await supabase.from('gallery').insert({ image_url: url });
        if (ex) throw ex;
      } catch (ex) {
        setErr(ex.message || 'Upload failed');
        break;
      }
    }
    setBusy('');
    reload();
  };

  const remove = async (p) => {
    if (!window.confirm('Delete this photo?')) return;
    const { error: ex } = await supabase.from('gallery').delete().eq('id', p.id);
    if (ex) return setErr(ex.message);
    deleteImageByUrl(p.image_url).catch(() => {});
    reload();
  };

  const caption = async (p, value) => {
    if (value === (p.caption || '')) return;
    await supabase.from('gallery').update({ caption: value.trim() || null }).eq('id', p.id);
    reload();
  };

  return (
    <>
      <Title sub="Upload photos (you can select many at once). Large photos are resized automatically.">Gallery</Title>
      {(err || error) && <div className="fld-e">{err || error}</div>}
      <Card
        title={`Photos (${rows.length})`}
        actions={
          <label className="btn-p">
            {busy || '+ Upload photos'}
            <input type="file" accept="image/*" multiple hidden onChange={upload} disabled={!!busy} />
          </label>
        }
      >
        {!loading && rows.length === 0 && <p className="fld-h">No photos yet.</p>}
        <div className="photo-grid">
          {rows.map((p) => (
            <div className="photo" key={`${p.id}-${p.caption}`}>
              <img src={p.image_url} alt="" />
              <input placeholder="Caption (optional)" defaultValue={p.caption || ''} onBlur={(e) => caption(p, e.target.value)} />
              <button type="button" className="btn-s danger" onClick={() => remove(p)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
