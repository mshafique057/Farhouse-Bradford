import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { fmtDateTime, useRows } from './hooks.js';
import { Card, Title } from './ui.jsx';

const ORDER = [['created_at', false]];
const STATUS = ['new', 'confirmed', 'cancelled'];

export default function Bookings() {
  const { rows, loading, error, reload } = useRows('bookings', ORDER);
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? rows : rows.filter((b) => b.status === filter);

  const setStatus = async (b, status) => {
    await supabase.from('bookings').update({ status }).eq('id', b.id);
    reload();
  };
  const remove = async (b) => {
    if (!window.confirm('Delete this booking?')) return;
    await supabase.from('bookings').delete().eq('id', b.id);
    reload();
  };

  return (
    <>
      <Title sub="Booking requests sent from the website.">Bookings</Title>
      {error && <div className="fld-e">{error}</div>}
      <div className="tabs">
        {['all', ...STATUS].map((s) => (
          <button key={s} type="button" className={s === filter ? 'on' : ''} onClick={() => setFilter(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <Card>
        {!loading && list.length === 0 && <p className="fld-h">No bookings.</p>}
        <div className="rows">
          {list.map((b) => (
            <div className="row-item col" key={b.id}>
              <div className="row-grow">
                <strong>{b.name}</strong> <span className={`badge ${b.status === 'confirmed' ? 'ok' : b.status === 'cancelled' ? 'bad' : ''}`}>{b.status}</span>
                <div>
                  {new Date(b.booking_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {b.booking_time} · {b.guests} guests
                </div>
                <div className="dim">
                  {b.phone}
                  {b.email ? ` · ${b.email}` : ''}
                </div>
                {b.notes && <div className="pre note-box">{b.notes}</div>}
                <div className="dim small">Received {fmtDateTime(b.created_at)}</div>
              </div>
              <div className="row-btns">
                <select value={b.status} onChange={(e) => setStatus(b, e.target.value)}>
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="button" className="btn-s danger" onClick={() => remove(b)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
