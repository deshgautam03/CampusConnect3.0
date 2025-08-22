import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaTrophy, FaFileAlt } from 'react-icons/fa';

const defaultForm = {
  title: '',
  description: '',
  shortDescription: '',
  category: 'Technical',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  venue: '',
  maxParticipants: 50,
  isTeamEvent: false,
  teamSize: 1,
  entryFee: 0,
  prizes: 'Participation Certificate',
  requirements: ''
};

const CreateEvent = () => {
  const [form, setForm] = useState(defaultForm);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('image', image);
    try {
      setSubmitting(true);
      await axios.post('/api/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Event created successfully!');
      setForm(defaultForm);
      setImage(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            padding: '30px', 
            textAlign: 'center' 
          }}>
            <h1 style={{ margin: '0', fontSize: '2.5rem' }}>
              <FaPlus style={{ marginRight: '15px' }} />
              Create New Event
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: '0.9', fontSize: '1.1rem' }}>
              Organize an exciting campus event for students
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '40px' }}>
            <form onSubmit={onSubmit} encType="multipart/form-data">
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
                        fontSize: '16px',
                        transition: 'border-color 0.3s'
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

              {/* Image Upload */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  marginBottom: '20px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ecf0f1'
                }}>
                  Event Image
                </h3>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '10px',
                      fontSize: '16px',
                      background: '#f8f9fa'
                    }}
                  />
                  <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
                    Upload an image to make your event more attractive (optional)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {submitting ? 'Creating Event...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;


