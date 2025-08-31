import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendarAlt, FaUsers, FaEye, FaEdit, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://campusconnect3-0.onrender.com/api/events/coordinator/my-events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Sort events by registration deadline (closest first) as backup
        const sortedEvents = res.data.sort((a, b) => {
          const deadlineA = new Date(a.registrationDeadline);
          const deadlineB = new Date(b.registrationDeadline);
          return deadlineB - deadlineA; // Descending order (closest deadline first)
        });
        
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '10px' }}>Loading your events...</span>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => new Date(event.registrationDeadline) >= new Date());
  const expiredEvents = events.filter(event => new Date(event.registrationDeadline) < new Date());

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <h1 style={{ 
          color: '#0f172a', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <FaCalendarAlt />
          My Events
        </h1>
        <Link 
          to="/create-event" 
          style={{
            background: 'linear-gradient(135deg, #0f172a, #0d9488)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <FaCalendarAlt />
          Create New Event
        </Link>
      </div>

      {/* Events Summary */}
      {events.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Upcoming Events</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {upcomingEvents.length}
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Expired Events</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {expiredEvents.length}
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #475569)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Total Events</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {events.length}
            </div>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #ecf0f1'
        }}>
          <FaCalendarAlt style={{ 
            fontSize: '4rem', 
            color: '#bdc3c7', 
            marginBottom: '20px' 
          }} />
          <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>
            No Events Created Yet
          </h3>
          <p style={{ color: '#95a5a6', marginBottom: '25px' }}>
            Start creating events to engage with students and manage campus activities.
          </p>
          <Link 
            to="/create-event" 
            style={{
              background: 'linear-gradient(135deg, #0f172a, #0d9488)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            <FaCalendarAlt />
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div>
          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#16a34a', 
                marginBottom: '20px',
                fontSize: '1.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaClock />
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                {upcomingEvents.map(event => (
                  <div key={event._id} style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '25px', 
                    background: 'white',
                    boxShadow: '0 10px 20px rgba(2,6,23,0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          margin: '0 0 15px 0', 
                          color: '#2c3e50',
                          fontSize: '1.5rem',
                          fontWeight: '600'
                        }}>
                          {event.title}
                        </h3>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                          gap: '15px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#6c757d' 
                          }}>
                            <FaClock />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#6c757d' 
                          }}>
                            <FaMapMarkerAlt />
                            <span>{event.venue}</span>
                          </div>
                          <div style={{ color: '#6c757d' }}>
                            Category: {event.category}
                          </div>
                        </div>

                        {event.shortDescription && (
                          <p style={{ 
                            color: '#34495e', 
                            lineHeight: '1.6',
                            marginBottom: '20px'
                          }}>
                            {event.shortDescription}
                          </p>
                        )}

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '20px',
                          color: '#6c757d',
                          fontSize: '14px'
                        }}>
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px' 
                          }}>
                            <FaUsers />
                            Max Participants: {event.maxParticipants}
                          </span>
                          <span>
                            Registration Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                            {(() => {
                              const now = new Date();
                              const deadline = new Date(event.registrationDeadline);
                              const diffTime = deadline - now;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 0) {
                                return ` (${diffDays} day${diffDays !== 1 ? 's' : ''} left)`;
                              } else if (diffDays < 0) {
                                return ` (${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago)`;
                              } else {
                                return ' (Today)';
                              }
                            })()}
                          </span>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        gap: '15px'
                      }}>
                        <div style={{
                          background: '#16a34a',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '700'
                        }}>
                          UPCOMING
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          gap: '10px',
                          flexDirection: 'column'
                        }}>
                          <Link 
                            to={`/event/${event._id}`} 
                            style={{
                              background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaEye />
                            View Details
                          </Link>
                          
                          <Link 
                            to={`/event-participants/${event._id}`} 
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaUsers />
                            View Participants
                          </Link>
                          
                          <Link 
                            to={`/edit-event/${event._id}`} 
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaEdit />
                            Edit Event
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expired Events Section */}
          {expiredEvents.length > 0 && (
            <div>
              <h2 style={{ 
                color: '#dc2626', 
                marginBottom: '20px',
                fontSize: '1.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaClock />
                Expired Events ({expiredEvents.length})
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                {expiredEvents.map(event => (
                  <div key={event._id} style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '25px', 
                    background: 'white',
                    boxShadow: '0 10px 20px rgba(2,6,23,0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    opacity: 0.8
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          margin: '0 0 15px 0', 
                          color: '#2c3e50',
                          fontSize: '1.5rem',
                          fontWeight: '600'
                        }}>
                          {event.title}
                        </h3>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                          gap: '15px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#6c757d' 
                          }}>
                            <FaClock />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#6c757d' 
                          }}>
                            <FaMapMarkerAlt />
                            <span>{event.venue}</span>
                          </div>
                          <div style={{ color: '#6c757d' }}>
                            Category: {event.category}
                          </div>
                        </div>

                        {event.shortDescription && (
                          <p style={{ 
                            color: '#34495e', 
                            lineHeight: '1.6',
                            marginBottom: '20px'
                          }}>
                            {event.shortDescription}
                          </p>
                        )}

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '20px',
                          color: '#6c757d',
                          fontSize: '14px'
                        }}>
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px' 
                          }}>
                            <FaUsers />
                            Max Participants: {event.maxParticipants}
                          </span>
                          <span>
                            Registration Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                            {(() => {
                              const now = new Date();
                              const deadline = new Date(event.registrationDeadline);
                              const diffTime = deadline - now;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 0) {
                                return ` (${diffDays} day${diffDays !== 1 ? 's' : ''} left)`;
                              } else if (diffDays < 0) {
                                return ` (${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago)`;
                              } else {
                                return ' (Today)';
                              }
                            })()}
                          </span>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        gap: '15px'
                      }}>
                        <div style={{
                          background: '#dc2626',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '700'
                        }}>
                          EXPIRED
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          gap: '10px',
                          flexDirection: 'column'
                        }}>
                          <Link 
                            to={`/event/${event._id}`} 
                            style={{
                              background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaEye />
                            View Details
                          </Link>
                          
                          <Link 
                            to={`/event-participants/${event._id}`} 
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaUsers />
                            View Participants
                          </Link>
                          
                          <Link 
                            to={`/edit-event/${event._id}`} 
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              justifyContent: 'center',
                              minWidth: '120px'
                            }}
                          >
                            <FaEdit />
                            Edit Event
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;


