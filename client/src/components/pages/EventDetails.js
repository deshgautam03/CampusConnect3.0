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
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        
        // Check if user has already applied
        if (isAuthenticated && user?.userType === 'student') {
          try {
            const applicationResponse = await axios.get(`/api/applications/student/my-applications`, {
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
      <div className="event-details-loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
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
    <div className="event-details">
      <div className="event-details-container">
        <div className="event-header">
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to Events
          </Link>
          <h1>{event.title}</h1>
          <p className="event-subtitle">{event.description}</p>
        </div>

        <div className="event-content">
          <div className="event-main-info">
            <div className="event-card">
              <div className="event-image">
                <div className="event-image-placeholder">
                  <FaCalendarAlt />
                  <span>Event Image</span>
                </div>
              </div>
              
              <div className="event-details-grid">
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div className="detail-content">
                    <h4>Event Date</h4>
                    <p>{formatDate(event.eventDate)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <div className="detail-content">
                    <h4>Time</h4>
                    <p>{formatTime(event.eventDate)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div className="detail-content">
                    <h4>Venue</h4>
                    <p>{event.venue}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaUsers className="detail-icon" />
                  <div className="detail-content">
                    <h4>Max Participants</h4>
                    <p>{event.maxParticipants || 'Unlimited'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <div className="detail-content">
                    <h4>Coordinator</h4>
                    <p>{event.coordinator?.name || 'TBD'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="event-sidebar">
            <div className="apply-section">
              {isAuthenticated && user?.userType === 'student' ? (
                hasApplied ? (
                  <div className="already-applied">
                    <h3>Already Applied</h3>
                    <p>You have already applied for this event.</p>
                    <Link to="/my-applications" className="btn btn-secondary">
                      View My Applications
                    </Link>
                  </div>
                ) : (
                  <div className="apply-now">
                    <h3>Apply for this Event</h3>
                    <p>Ready to participate? Click below to apply!</p>
                    <button 
                      onClick={handleApplyNow}
                      className="btn btn-primary btn-large"
                    >
                      Apply Now
                    </button>
                  </div>
                )
              ) : (
                <div className="login-required">
                  <h3>Login Required</h3>
                  <p>You need to be logged in as a student to apply for this event.</p>
                  <div className="auth-buttons">
                    <Link to="/login" className="btn btn-primary">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-outline">
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="event-info-card">
              <h3>Event Information</h3>
              <div className="info-item">
                <strong>Registration Deadline:</strong>
                <span>{formatDate(event.registrationDeadline)}</span>
              </div>
              <div className="info-item">
                <strong>Event Type:</strong>
                <span>{event.eventType || 'General'}</span>
              </div>
              <div className="info-item">
                <strong>Department:</strong>
                <span>{event.department || 'All Departments'}</span>
              </div>
              <div className="info-item">
                <strong>Year:</strong>
                <span>{event.year || 'All Years'}</span>
              </div>
            </div>

            {/* Action Buttons for Coordinators and Faculty */}
            {(user?.userType === 'coordinator' || user?.userType === 'faculty') && (
              <div className="coordinator-actions">
                <h3>Event Management</h3>
                <div className="action-buttons">
                  <Link 
                    to={`/event-participants/${event._id}`} 
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '10px' }}
                  >
                    <FaUsers style={{ marginRight: '8px' }} />
                    View Participants
                  </Link>
                  {user?.userType === 'coordinator' && (
                    <Link 
                      to={`/edit-event/${event._id}`} 
                      className="btn btn-secondary"
                      style={{ width: '100%' }}
                    >
                      <FaEdit style={{ marginRight: '8px' }} />
                      Edit Event
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="event-description">
          <h2>Event Description</h2>
          <div className="description-content">
            <p>{event.description}</p>
            {event.additionalDetails && (
              <div className="additional-details">
                <h4>Additional Details:</h4>
                <p>{event.additionalDetails}</p>
              </div>
            )}
          </div>
        </div>

        {/* View Participants Section for All Users */}
        <div className="view-participants-section">
          <h2>Event Participants</h2>
          <p>See who's participating in this event and track the current participation status.</p>
          <Link to={`/event-participants/${event._id}`} className="btn btn-primary btn-large">
            <FaUsers style={{ marginRight: '10px' }} />
            View Participants
          </Link>
        </div>

        {event.rules && (
          <div className="event-rules">
            <h2>Event Rules & Guidelines</h2>
            <div className="rules-content">
              <p>{event.rules}</p>
            </div>
          </div>
        )}

        {event.prizes && (
          <div className="event-prizes">
            <h2>Prizes & Rewards</h2>
            <div className="prizes-content">
              <p>{event.prizes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
