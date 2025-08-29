import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaTrophy, FaFileAlt } from 'react-icons/fa';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          shortDescription: res.data.shortDescription || '',
          category: res.data.category || 'Technical',
          startDate: res.data.startDate ? new Date(res.data.startDate).toISOString().slice(0, 16) : '',
          endDate: res.data.endDate ? new Date(res.data.endDate).toISOString().slice(0, 16) : '',
          registrationDeadline: res.data.registrationDeadline ? new Date(res.data.registrationDeadline).toISOString().slice(0, 16) : '',
          venue: res.data.venue || '',
          maxParticipants: res.data.maxParticipants || 50,
          isTeamEvent: res.data.isTeamEvent || false,
          teamSize: res.data.teamSize || 1,
          entryFee: res.data.entryFee || 0,
          prizes: res.data.prizes || 'Participation Certificate',
          requirements: res.data.requirements || ''
        });
      } catch (error) {
        toast.error('Error loading event');
        navigate('/my-events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/events/${id}`, form);
      toast.success('Event updated successfully!');
      navigate('/my-events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Event Not Found</h2>
        <p>The event you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: '#f8fafc',
      padding: '20px 0'
    }}>
      <div className="container">
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)', 
            color: 'white', 
            padding: '30px', 
            textAlign: 'center' 
          }}>
            <h1 style={{ margin: '0', fontSize: '2.5rem' }}>
              <FaEdit style={{ marginRight: '15px' }} />
              Edit Event
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: '0.9', fontSize: '1.1rem' }}>
              Update event details and information
            </p>
            
            {/* Action Buttons */}
            <div style={{ 
              marginTop: '20px',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to={`/event/${id}`}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
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
                View Event
              </Link>
              
              <Link
                to={`/event-participants/${id}`}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
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
                View Participants
              </Link>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: '40px' }}>
            <form onSubmit={onSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  marginBottom: '20px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ecf0f1'
                }}>
                  Basic Information
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Event Title *
                    </label>
                    <input
                      name="title"
                      placeholder="Enter event title"
                      value={form.title}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Short Description *
                    </label>
                    <input
                      name="shortDescription"
                      placeholder="Brief description (max 200 characters)"
                      value={form.shortDescription}
                      onChange={onChange}
                      required
                      maxLength={200}
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Detailed description of the event"
                      value={form.description}
                      onChange={onChange}
                      required
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                        Category *
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '10px',
                          fontSize: '16px'
                        }}
                      >
                        {['Technical','Cultural','Sports','Academic','Workshop','Seminar','Other'].map(c => 
                          <option key={c} value={c}>{c}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                        Venue *
                      </label>
                      <input
                        name="venue"
                        placeholder="Event venue"
                        value={form.venue}
                        onChange={onChange}
                        required
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '10px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  marginBottom: '20px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ecf0f1'
                }}>
                  <FaCalendarAlt style={{ marginRight: '10px' }} />
                  Date and Time
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={form.startDate}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={form.endDate}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Registration Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationDeadline"
                      value={form.registrationDeadline}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Participation Details */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  marginBottom: '20px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ecf0f1'
                }}>
                  <FaUsers style={{ marginRight: '10px' }} />
                  Participation Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Maximum Participants *
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={form.maxParticipants}
                      onChange={onChange}
                      required
                      min="1"
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Entry Fee
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FaDollarSign style={{ 
                        position: 'absolute', 
                        left: '15px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#6c757d' 
                      }} />
                      <input
                        type="number"
                        name="entryFee"
                        value={form.entryFee}
                        onChange={onChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '15px 15px 15px 40px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '10px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    marginBottom: '15px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    <input
                      type="checkbox"
                      name="isTeamEvent"
                      checked={form.isTeamEvent}
                      onChange={onChange}
                      style={{ transform: 'scale(1.3)' }}
                    />
                    This is a team event
                  </label>
                  
                  {form.isTeamEvent && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                        Team Size
                      </label>
                      <input
                        type="number"
                        name="teamSize"
                        value={form.teamSize}
                        onChange={onChange}
                        min="2"
                        max="10"
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '10px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  marginBottom: '20px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ecf0f1'
                }}>
                  <FaFileAlt style={{ marginRight: '10px' }} />
                  Additional Details
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      <FaTrophy style={{ marginRight: '8px' }} />
                      Prizes
                    </label>
                    <input
                      name="prizes"
                      placeholder="What prizes will be awarded?"
                      value={form.prizes}
                      onChange={onChange}
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      placeholder="Any specific requirements for participants?"
                      value={form.requirements}
                      onChange={onChange}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                    color: 'white',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {submitting ? 'Updating Event...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
