import { useState } from 'react';
import { useSite } from '../lib/SiteContext.jsx';
import { sendBooking } from '../lib/api.js';
import PageHead from '../components/PageHead.jsx';

const today = () => new Date().toISOString().slice(0, 10);

export default function Booking() {
  const p = useSite().settings.pages.booking;
  const [f, setF] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '', website: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (!p.enabled) {
    return (
      <>
        <PageHead title={p.title} />
        <p className="container empty">Online booking is not available right now.</p>
      </>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return setState({ busy: false, done: true, error: '' });
    setState({ busy: true, done: false, error: '' });
    try {
      await sendBooking({
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || null,
        booking_date: f.date,
        booking_time: f.time,
        guests: Number(f.guests) || 1,
        notes: f.notes.trim() || null,
      });
      setState({ busy: false, done: true, error: '' });
    } catch {
      setState({ busy: false, done: false, error: 'Sorry, something went wrong. Please try again later.' });
    }
  };

  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight narrow">
        {state.done ? (
          <div className="notice ok">{p.successMessage}</div>
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="form-row">
              <label>
                Name
                <input required maxLength={120} value={f.name} onChange={set('name')} />
              </label>
              <label>
                Phone
                <input required type="tel" maxLength={40} value={f.phone} onChange={set('phone')} />
              </label>
            </div>
            <label>
              Email (optional)
              <input type="email" maxLength={160} value={f.email} onChange={set('email')} />
            </label>
            <div className="form-row three">
              <label>
                Date
                <input required type="date" min={today()} value={f.date} onChange={set('date')} />
              </label>
              <label>
                Time
                <input required type="time" value={f.time} onChange={set('time')} />
              </label>
              <label>
                Guests
                <input required type="number" min="1" max="200" value={f.guests} onChange={set('guests')} />
              </label>
            </div>
            <label>
              Notes (optional)
              <textarea rows="3" maxLength={1000} value={f.notes} onChange={set('notes')} />
            </label>
            <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} />
            {state.error && <div className="notice err">{state.error}</div>}
            <button className="btn" disabled={state.busy}>
              {state.busy ? 'Sending…' : 'Request booking'}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
