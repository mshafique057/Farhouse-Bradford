import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Agar .env set nahi hai to site default (Under construction) ke sath chalti hai.
export const isConfigured = Boolean(url && key);
export const supabase = isConfigured ? createClient(url, key) : null;
