import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { fmtDateTime, useRows } from './hooks.js';
import { Card, Title } from './ui.jsx';

const ORDER = [['created_at', false]];

export default function Messages() {
  const { rows, loading, error, reload } = useRows('messages', ORDER);
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? rows : rows.filter((m) => m.type === filter);

  const toggleRead = async (m) => {
    await supabase.from('messages').update({ is_read: !m.is_read }).eq('id', m.id);
    reload();
  };
  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', m.id);
    reload();
  };

  return (
    <>
      <Title sub="Messages from the Contact and Franchise forms.">Messages</Title>
      {error && <div className="fld-e">{error}</div>}
      <div className="tabs">
        {['all', 'contact', 'franchise'].map((s) => (
          <button key={s} type="button" className={s === filter ? 'on' : ''} onClick={() => setFilter(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <Card>
        {!loading && list.length === 0 && <p className="fld-h">No messages.</p>}
        <div className="rows">
          {list.map((m) => (
            <div className={`row-item col${m.is_read ? '' : ' unread'}`} key={m.id}>
              <div className="row-grow">
                <strong>{m.name}</strong> <span className="badge">{m.type}</span> {!m.is_read && <span className="badge ok">New</span>}
                <div className="dim">
                  {[m.phone, m.email].filter(Boolean).join(' · ')}
                </div>
                {m.subject && <div>Area: {m.subject}</div>}
                {m.message && <div className="pre note-box">{m.message}</div>}
                <div className="dim small">{fmtDateTime(m.created_at)}</div>
              </div>
              <div className="row-btns">
                <button type="button" className="btn-s" onClick={() => toggleRead(m)}>
                  Mark as {m.is_read ? 'unread' : 'read'}
                </button>
                <button type="button" className="btn-s danger" onClick={() => remove(m)}>
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
