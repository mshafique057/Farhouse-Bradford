import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useSite } from '../lib/SiteContext.jsx';
import { setIn } from '../lib/utils.js';

// Settings ka draft: edit karo, "Save changes" dabao
export function useSettingsEditor() {
  const { settings, saveSettings } = useSite();
  const latest = useRef(settings);
  latest.current = settings;
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const strip = (s) => JSON.stringify({ ...s, mode: '' }); // mode alag se save hota hai
  const dirty = strip(draft) !== strip(settings);

  const set = (path, value) => {
    setMsg(null);
    setDraft((d) => setIn(d, path, value));
  };
  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await saveSettings({ ...draft, mode: latest.current.mode });
      setMsg({ ok: true, text: 'Saved. Changes are live on the website.' });
    } catch (e) {
      setMsg({ ok: false, text: e.message || 'Could not save' });
    }
    setSaving(false);
  };
  return { draft, set, save, saving, dirty, msg };
}

// Kisi table ki rows load karne ke liye
export function useRows(table, order = [['id', true]]) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const key = JSON.stringify(order);
  const reload = useCallback(async () => {
    let q = supabase.from(table).select('*');
    JSON.parse(key).forEach(([c, asc]) => {
      q = q.order(c, { ascending: asc });
    });
    const { data, error: err } = await q;
    if (err) setError(err.message);
    else {
      setRows(data);
      setError('');
    }
    setLoading(false);
  }, [table, key]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { rows, loading, error, reload };
}

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
