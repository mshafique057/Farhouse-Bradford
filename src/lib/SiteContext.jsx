import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from './supabase.js';
import { DEFAULT_SETTINGS } from './defaults.js';
import { deepMerge } from './utils.js';

const Ctx = createContext(null);
export const useSite = () => useContext(Ctx);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(isConfigured);
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return undefined;
    supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings(deepMerge(DEFAULT_SETTINGS, data?.data || {}));
        setLoading(false);
      });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Theme colours -> CSS variables
  useEffect(() => {
    const t = settings.theme;
    const s = document.documentElement.style;
    s.setProperty('--primary', t.primary);
    s.setProperty('--secondary', t.secondary);
    s.setProperty('--accent', t.accent);
    s.setProperty('--bg', t.background);
    s.setProperty('--text', t.text);
  }, [settings.theme]);

  // Browser title + description
  useEffect(() => {
    document.title = settings.seo.title || settings.brand.fullName;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement('meta');
      m.name = 'description';
      document.head.appendChild(m);
    }
    m.content = settings.seo.description || '';
  }, [settings.seo, settings.brand.fullName]);

  const saveSettings = async (next) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, data: next, updated_at: new Date().toISOString() });
    if (error) throw error;
    setSettings(next);
  };

  return (
    <Ctx.Provider value={{ settings, loading, session, authReady, saveSettings }}>{children}</Ctx.Provider>
  );
}
