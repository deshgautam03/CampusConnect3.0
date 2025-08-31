import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEye } from 'react-icons/fa';
import axios from 'axios';

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://campusconnect3-0.onrender.com/api/events');
        const now = new Date();
        const expired = res.data.filter(e => {
          if (!e || !e.registrationDeadline) return false;
          try { return new Date(e.registrationDeadline) < now; } catch { return false; }
        });
        // Sort by most recently expired first
        expired.sort((a, b) => new Date(b.registrationDeadline) - new Date(a.registrationDeadline));
        setEvents(expired);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: '#64748b' }}>Loading past events...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #64748b 100%)',
        color: 'white',
        padding: '48px 0 28px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '10px' }}>Past Events</h1>
          <p style={{ opacity: 0.9 }}>Browse events whose registration deadlines have passed</p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>No past events</h3>
            <p>New events will appear here after their deadlines.</p>
          </div>
        ) : (
          <div className="row">
            {events.map((event) => (
              <div key={event._id} className="col-md-4" style={{ marginBottom: '30px' }}>
                <div className="event-card" style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: '0 10px 20px rgba(2,6,23,0.06)'
                }}>
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: '#e2e8f0',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '10px'
                    }}>{event.category}</div>

                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>{event.title}</h3>

                    <p style={{
                      color: '#475569',
                      marginTop: '8px',
                      marginBottom: '12px',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.description || event.shortDescription}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', color: '#475569', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt /> {formatDate(event.startDate)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <FaMapMarkerAlt /> {event.venue}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaUsers /> {(event.currentParticipants || 0)}/{event.maxParticipants}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/event/${event._id}`} style={{
                        flex: 1,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 700,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #475569, #0f172a)'
                      }}>
                        <FaEye style={{ marginRight: '6px' }} /> View
                      </Link>
                      <Link to={`/event-participants/${event._id}`} style={{
                        flex: 1,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: '#0f172a',
                        fontWeight: 700,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                      }}>
                        <FaUsers style={{ marginRight: '6px' }} /> Participants
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;


