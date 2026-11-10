import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

export const slugify = (s = '') =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// setIn(obj, 'a.b.0.c', value) -> immutable update
export function setIn(obj, path, value) {
  const keys = path.split('.');
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = root;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
    } else {
      const next = cur[k];
      cur[k] = Array.isArray(next) ? [...next] : { ...next };
      cur = cur[k];
    }
  });
  return root;
}

// Saved settings ko defaults ke upar merge karta hai (arrays poori replace hoti hain)
export function deepMerge(base, extra) {
  if (extra === undefined || extra === null) return base;
  if (Array.isArray(extra)) return extra;
  if (typeof extra === 'object' && base && typeof base === 'object' && !Array.isArray(base)) {
    const out = { ...base };
    Object.keys(extra).forEach((k) => {
      out[k] = deepMerge(base[k], extra[k]);
    });
    return out;
  }
  return extra;
}

export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let on = true;
    setState((s) => ({ ...s, loading: true }));
    Promise.resolve()
      .then(fn)
      .then((data) => on && setState({ data, loading: false, error: null }))
      .catch((error) => on && setState({ data: null, loading: false, error }));
    return () => {
      on = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

// ---------- Images ----------
async function resizeImage(file, max = 1600) {
  const skip = !file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif';
  if (skip) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const type = file.type === 'image/png' ? 'image/png' : 'image/webp';
    const blob = await new Promise((r) => canvas.toBlob(r, type, 0.85));
    return blob || file;
  } catch {
    return file;
  }
}

export async function uploadImage(file) {
  const blob = await resizeImage(file);
  const ext =
    blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('media')
    .upload(name, blob, { contentType: blob.type || file.type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from('media').getPublicUrl(name).data.publicUrl;
}

export async function deleteImageByUrl(url) {
  const marker = '/media/';
  const i = url?.indexOf(marker);
  if (!url || i < 0) return;
  await supabase.storage.from('media').remove([url.slice(i + marker.length)]);
}
