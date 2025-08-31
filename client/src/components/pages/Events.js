import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://campusconnect3-0.onrender.com/api/events');
        // Keep raw events; initial filtered list will be computed in the effect below
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Exclude expired events (deadline passed)
    const now = new Date();
    let filtered = events.filter(e => {
      if (!e || !e.registrationDeadline) return true;
      try {
        return new Date(e.registrationDeadline) >= now;
      } catch {
        return true;
      }
    });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categories = ['all', 'Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other'];

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: '#64748b' }}>Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero strip */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '48px 0 28px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '10px' }}>Campus Events</h1>
          <p style={{ opacity: 0.9 }}>Discover and participate in exciting campus events</p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>

        {/* Search and Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px', 
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#64748b' 
            }} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                background: '#ffffff'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFilter />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                background: '#ffffff'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>No events found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="row">
            {filteredEvents.map((event) => (
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
                      style={{
                        width: '100%',
                        height: '190px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                      color: 'white',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <FaClock /> {event.entryFee > 0 ? `$${event.entryFee}` : 'Free'}
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
                        background: 'linear-gradient(135deg, #0f172a, #0d9488)'
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

        {/* Results Count and Past Events Link */}
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#64748b' }}>
          Showing {filteredEvents.length} of {events.length} active events
          <div style={{ marginTop: '8px' }}>
            <Link to="/past-events" style={{ textDecoration: 'none', fontWeight: 600 }}>
              View Past Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
