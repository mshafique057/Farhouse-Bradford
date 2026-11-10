import { useState } from 'react';
import { uploadImage } from '../lib/utils.js';

export function Field({ label, hint, children }) {
  return (
    <label className="fld">
      <span className="fld-l">{label}</span>
      {children}
      {hint && <span className="fld-h">{hint}</span>}
    </label>
  );
}

export function Text({ label, hint, value, onChange, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function Area({ label, hint, value, onChange, rows = 4 }) {
  return (
    <Field label={label} hint={hint}>
      <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="tgl">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export function Color({ label, value, onChange }) {
  return (
    <Field label={label}>
      <span className="clr">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <code>{value}</code>
      </span>
    </Field>
  );
}

export function ImageField({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(file));
    } catch (ex) {
      setErr(ex.message || 'Upload failed');
    }
    setBusy(false);
  };
  return (
    <div className="fld">
      <span className="fld-l">{label}</span>
      <div className="img-field">
        {value ? <img src={value} alt="" /> : <div className="img-ph">No image</div>}
        <div className="img-btns">
          <label className="btn-s">
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" hidden onChange={pick} disabled={busy} />
          </label>
          {value && (
            <button type="button" className="btn-s ghost" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
      </div>
      {err && <span className="fld-e">{err}</span>}
      {hint && <span className="fld-h">{hint}</span>}
    </div>
  );
}

export function Card({ title, actions, children }) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-head">
          <h2>{title}</h2>
          <div>{actions}</div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Title({ children, sub }) {
  return (
    <div className="ptitle">
      <h1>{children}</h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function SaveBar({ dirty, saving, msg, onSave }) {
  return (
    <div className="savebar">
      <span className={msg ? (msg.ok ? 'ok' : 'err') : 'dim'}>
        {msg ? msg.text : dirty ? 'You have unsaved changes' : 'All changes saved'}
      </span>
      <button type="button" className="btn-p" disabled={!dirty || saving} onClick={onSave}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

