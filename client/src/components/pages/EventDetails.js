import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaUser, FaArrowLeft, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://campusconnect3-0.onrender.com/api/events/${id}`);
        setEvent(response.data);
        
        // Check if user has already applied
        if (isAuthenticated && user?.userType === 'student') {
          try {
            const applicationResponse = await axios.get(`https://campusconnect3-0.onrender.com/api/applications/student/my-applications`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const hasAppliedToEvent = applicationResponse.data.some(
              app => app.event === id
            );
            setHasApplied(hasAppliedToEvent);
          } catch (error) {
            console.error('Error checking application status:', error);
          }
        }
      } catch (error) {
        setError('Event not found or error loading event details');
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, isAuthenticated, user]);

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login', { state: { from: `/event/${id}` } });
    } else if (user?.userType === 'student') {
      // Navigate to application form
      navigate(`/apply/${id}`);
    } else {
      // Show message for non-students
      alert('Only students can apply for events.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: '#64748b' }}>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-error">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '48px 0 28px 0'
      }}>
        <div className="container">
          <Link to="/events" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
            <FaArrowLeft /> Back to Events
          </Link>
          <h1 style={{ marginTop: '10px', marginBottom: '6px', fontWeight: 800 }}>{event.title}</h1>
          <p style={{ opacity: 0.9, maxWidth: 800 }}>{event.description}</p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="col-md-8" style={{ marginBottom: '20px' }}>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(2,6,23,0.06)'
            }}>
              <div style={{
                width: '100%',
                height: '280px',
                background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontWeight: 700
              }}>
                <FaCalendarAlt style={{ marginRight: 8 }} /> <img src={event.image} style={{height:"280px",width:"100%"}}/>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <FaCalendarAlt />
                    <div>
                      <div style={{ fontWeight: 700 }}>Event Date</div>
                      <div>{formatDate(event.eventDate)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <FaClock />
                    <div>
                      <div style={{ fontWeight: 700 }}>Time</div>
                      <div>{formatTime(event.eventDate)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <FaMapMarkerAlt />
                    <div>
                      <div style={{ fontWeight: 700 }}>Venue</div>
                      <div>{event.venue}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <FaUsers />
                    <div>
                      <div style={{ fontWeight: 700 }}>Max Participants</div>
                      <div>{event.maxParticipants || 'Unlimited'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 20px rgba(2,6,23,0.06)' }}>
              <h2 style={{ marginTop: 0 }}>Event Description</h2>
              <p>{event.description}</p>
              {event.additionalDetails && (
                <div>
                  <h4>Additional Details:</h4>
                  <p>{event.additionalDetails}</p>
                </div>
              )}
              {event.rules && (
                <div>
                  <h3>Event Rules & Guidelines</h3>
                  <p>{event.rules}</p>
                </div>
              )}
              {event.prizes && (
                <div>
                  <h3>Prizes & Rewards</h3>
                  <p>{event.prizes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 20px rgba(2,6,23,0.06)' }}>
              {isAuthenticated && user?.userType === 'student' ? (
                hasApplied ? (
                  <div>
                    <h3>Already Applied</h3>
                    <p>You have already applied for this event.</p>
                    <Link to="/my-applications" className="btn btn-secondary">
                      View My Applications
                    </Link>
                  </div>
                ) : (
                  <div>
                    <h3>Apply for this Event</h3>
                    <p>Ready to participate? Click below to apply!</p>
                    <button onClick={handleApplyNow} className="btn btn-primary btn-large">
                      Apply Now
                    </button>
                  </div>
                )
              ) : (
                <div>
                  <h3>Login Required</h3>
                  <p>You need to be logged in as a student to apply for this event.</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                    <Link to="/register" className="btn btn-outline">Sign Up</Link>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 20px rgba(2,6,23,0.06)' }}>
              <h3>Event Information</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Registration Deadline:</strong>
                  <span>{formatDate(event.registrationDeadline)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Event Type:</strong>
                  <span>{event.eventType || 'General'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Department:</strong>
                  <span>{event.department || 'All Departments'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Year:</strong>
                  <span>{event.year || 'All Years'}</span>
                </div>
              </div>
            </div>

            {(user?.userType === 'coordinator' || user?.userType === 'faculty') && (
              <div style={{ marginTop: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 20px rgba(2,6,23,0.06)' }}>
                <h3>Event Management</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to={`/event-participants/${event._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    <FaUsers style={{ marginRight: '8px' }} /> View Participants
                  </Link>
                  {user?.userType === 'coordinator' && (
                    <Link to={`/edit-event/${event._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                      <FaEdit style={{ marginRight: '8px' }} /> Edit Event
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to={`/event-participants/${event._id}`} className="btn btn-primary btn-large">
            <FaUsers style={{ marginRight: '10px' }} /> View Participants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
