import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useSite } from '../lib/SiteContext.jsx';
import { Card, Text, Title } from './ui.jsx';

export default function Account() {
  const { session } = useSite();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState(null);

  const change = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return setMsg({ ok: false, text: 'Password must be at least 8 characters.' });
    if (pw !== pw2) return setMsg({ ok: false, text: 'Passwords do not match.' });
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return setMsg({ ok: false, text: error.message });
    setPw('');
    setPw2('');
    setMsg({ ok: true, text: 'Password changed.' });
  };

  return (
    <>
      <Title>Account</Title>
      <Card title="Change password">
        <p className="fld-h">Logged in as {session?.user?.email}</p>
        <form onSubmit={change}>
          <Text label="New password" type="password" autoComplete="new-password" value={pw} onChange={setPw} />
          <Text label="Repeat new password" type="password" autoComplete="new-password" value={pw2} onChange={setPw2} />
          {msg && <div className={msg.ok ? 'fld-ok' : 'fld-e'}>{msg.text}</div>}
          <button className="btn-p">Change password</button>
        </form>
      </Card>
    </>
  );
}
