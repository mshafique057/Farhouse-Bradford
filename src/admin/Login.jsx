import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr('Wrong email or password.');
    setBusy(false);
  };

  return (
    <div className="adm login-wrap">
      <form className="login-box" onSubmit={submit}>
        <h1>Admin login</h1>
        <label className="fld">
          <span className="fld-l">Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="fld">
          <span className="fld-l">Password</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && <div className="fld-e">{err}</div>}
        <button className="btn-p" disabled={busy}>
          {busy ? 'Signing in…' : 'Log in'}
        </button>
        <Link to="/">← Back to website</Link>
      </form>
    </div>
  );
}
