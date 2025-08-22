import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/events/coordinator/my-events');
        setEvents(res.data);
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h2 style={{ marginBottom: 16 }}>My Events</h2>
      {events.length === 0 && <p>No events created yet.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {events.map(ev => (
          <div key={ev._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: 'white' }}>
            <div style={{ fontWeight: 600 }}>{ev.title}</div>
            <div style={{ color: '#6c757d', fontSize: 13 }}>
              {new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()} • {ev.venue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;


