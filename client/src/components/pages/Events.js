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
        const res = await axios.get('/api/events');
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

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
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#2c3e50' }}>
            Campus Events
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
            Discover and participate in exciting campus events
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px', 
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
              color: '#6c757d' 
            }} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
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
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
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
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%'
                }}>
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      background: '#3498db',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      display: 'inline-block',
                      marginBottom: '12px'
                    }}>
                      {event.category}
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.3rem',
                      marginBottom: '12px',
                      color: '#2c3e50',
                      lineHeight: '1.4'
                    }}>
                      {event.title}
                    </h3>
                    
                    <p style={{
                      color: '#6c757d',
                      marginBottom: '20px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.description || event.shortDescription}
                    </p>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <FaCalendarAlt />
                        {formatDate(event.startDate)}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <FaMapMarkerAlt />
                        {event.venue}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <FaUsers />
                        {event.currentParticipants || 0}/{event.maxParticipants}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <FaClock />
                        {event.entryFee > 0 ? `$${event.entryFee}` : 'Free'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        to={`/event/${event._id}`} 
                        className="btn btn-primary"
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        <FaEye style={{ marginRight: '5px' }} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
