import { useState } from 'react';
import { sendMessage } from '../lib/api.js';

// Contact aur Franchise dono ke liye
export default function EnquiryForm({ type, subjectLabel }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', subject: '', message: '', website: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return setState({ busy: false, done: true, error: '' }); // honeypot (bots)
    setState({ busy: true, done: false, error: '' });
    try {
      await sendMessage({
        type,
        name: f.name.trim(),
        phone: f.phone.trim() || null,
        email: f.email.trim() || null,
        subject: f.subject.trim() || null,
        message: f.message.trim() || null,
      });
      setState({ busy: false, done: true, error: '' });
    } catch (err) {
      setState({ busy: false, done: false, error: 'Sorry, something went wrong. Please try again later.' });
    }
  };

  if (state.done) return <div className="notice ok">Thank you! Your message has been sent.</div>;

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Name
          <input required maxLength={120} value={f.name} onChange={set('name')} />
        </label>
        <label>
          Phone
          <input type="tel" maxLength={40} value={f.phone} onChange={set('phone')} />
        </label>
      </div>
      <label>
        Email
        <input type="email" maxLength={160} value={f.email} onChange={set('email')} />
      </label>
      {subjectLabel && (
        <label>
          {subjectLabel}
          <input maxLength={200} value={f.subject} onChange={set('subject')} />
        </label>
      )}
      <label>
        Message
        <textarea rows="5" maxLength={3000} required value={f.message} onChange={set('message')} />
      </label>
      <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} />
      {state.error && <div className="notice err">{state.error}</div>}
      <button className="btn" disabled={state.busy}>
        {state.busy ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
