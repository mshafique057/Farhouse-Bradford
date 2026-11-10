import { supabase, isConfigured } from './supabase.js';

const must = (res) => {
  if (res.error) throw res.error;
  return res.data || [];
};

export async function getMenu() {
  if (!isConfigured) return { categories: [], items: [] };
  const [c, i] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort').order('id'),
    supabase.from('menu_items').select('*').eq('available', true).order('sort').order('id'),
  ]);
  return { categories: must(c), items: must(i) };
}

export async function getGallery(limit) {
  if (!isConfigured) return [];
  let q = supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);
  return must(await q);
}

export async function getPosts(limit) {
  if (!isConfigured) return [];
  let q = supabase
    .from('posts')
    .select('id,title,slug,excerpt,cover_url,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);
  return must(await q);
}

export async function getPost(slug) {
  if (!isConfigured) return null;
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function sendBooking(row) {
  if (!isConfigured) throw new Error('Booking is not available yet.');
  const { error } = await supabase.from('bookings').insert(row);
  if (error) throw error;
}

export async function sendMessage(row) {
  if (!isConfigured) throw new Error('Messages are not available yet.');
  const { error } = await supabase.from('messages').insert(row);
  if (error) throw error;
}
