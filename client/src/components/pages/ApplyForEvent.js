import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaArrowLeft, FaUsers, FaUser, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ApplyForEvent.css';

const ApplyForEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    isTeamApplication: false,
    teamName: '',
    teamMembers: [''],
    additionalInfo: ''
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Error loading event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchEventDetails();
    } else {
      navigate('/login');
    }
  }, [id, user, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTeamMemberChange = (index, value) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = value;
    setFormData(prev => ({
      ...prev,
      teamMembers: newTeamMembers
    }));
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < (event?.teamSize || 4)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, '']
      }));
    }
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > 1) {
      const newTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        teamMembers: newTeamMembers
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.isTeamApplication && !formData.teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    if (formData.isTeamApplication && formData.teamMembers.some(member => !member.trim())) {
      toast.error('Please fill in all team member names');
      return;
    }

    try {
      setSubmitting(true);
      
      const applicationData = {
        event: id,
        isTeamApplication: formData.isTeamApplication,
        additionalInfo: formData.additionalInfo
      };

      if (formData.isTeamApplication) {
        applicationData.teamName = formData.teamName;
        applicationData.teamMembers = formData.teamMembers.filter(member => member.trim());
      }

      await axios.post('/api/applications', applicationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error submitting application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="apply-loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="apply-error">
        <h2>Event Not Found</h2>
        <p>The event you're trying to apply for doesn't exist.</p>
        <Link to="/events" className="btn btn-primary">
          <FaArrowLeft /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      padding: '20px 0'
    }}>
      <div className="container">
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', 
            color: 'white', 
            padding: '30px', 
            textAlign: 'center' 
          }}>
            <h2 style={{ margin: '0', fontSize: '2rem' }}>Apply for Event</h2>
            <div style={{ marginTop: '15px' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', opacity: '0.9' }}>{event.title}</h3>
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center', 
                marginTop: '10px',
                fontSize: '14px',
                opacity: '0.8'
              }}>
                <span><FaCalendarAlt /> {new Date(event.startDate).toLocaleDateString()}</span>
                <span><FaMapMarkerAlt /> {event.venue}</span>
              </div>
              
              {/* View Participants Button */}
              <div style={{ marginTop: '20px' }}>
                <Link
                  to={`/event-participants/${event._id}`}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                >
                  <FaUsers />
                  View Current Participants
                </Link>
              </div>
            </div>
          </div>

          <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  <input
                    type="checkbox"
                    name="isTeamApplication"
                    checked={formData.isTeamApplication}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  This is a team application
                </label>
              </div>

              {formData.isTeamApplication && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Team Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your team name"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Team Members *
                    </label>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px' }}>
                          <input
                            type="text"
                            value={member}
                            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                            placeholder={`Team member ${index + 1} name`}
                            required
                            style={{
                              flex: 1,
                              padding: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              fontSize: '16px'
                            }}
                          />
                          {formData.teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              style={{
                                padding: '12px 16px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {formData.teamMembers.length < (event.teamSize || 4) && (
                      <button
                        type="button"
                        onClick={addTeamMember}
                        style={{
                          marginTop: '10px',
                          padding: '10px 20px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <FaUsers /> Add Team Member
                      </button>
                    )}
                  </div>
                </>
              )}

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like to share..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Link 
                  to={`/event/${id}`} 
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    color: '#6c757d',
                    border: '1px solid #6c757d',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 30px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForEvent;
