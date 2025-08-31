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
        const response = await axios.get(`https://campusconnect3-0.onrender.com/api/events/${id}`);
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

      await axios.post('https://campusconnect3-0.onrender.com/api/applications', applicationData, {
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
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: '#64748b' }}>Loading event details...</p>
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
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '36px 0 20px 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Apply for Event</h2>
          <div style={{ marginTop: '10px' }}>
            <h3 style={{ margin: '0', fontSize: '1.2rem', opacity: '0.9' }}>{event.title}</h3>
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center', 
              marginTop: '10px',
              fontSize: '14px',
              opacity: '0.9'
            }}>
              <span><FaCalendarAlt /> {new Date(event.startDate).toLocaleDateString()}</span>
              <span><FaMapMarkerAlt /> {event.venue}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container" style={{ padding: '20px 0' }}>
        <div style={{ 
          maxWidth: '640px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
            <Link
              to={`/event-participants/${event._id}`}
              style={{
                background: '#f1f5f9',
                color: '#0f172a',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '700',
                border: '1px solid #e2e8f0'
              }}
            >
              <FaUsers /> View Current Participants
            </Link>
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
                    background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
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
