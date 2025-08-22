import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding } from 'react-icons/fa';

const EventParticipants = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, applicationsRes] = await Promise.all([
          axios.get(`/api/events/${id}`),
          axios.get(`/api/applications/event/${id}`)
        ]);
        setEvent(eventRes.data);
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      approved: '#27ae60',
      rejected: '#e74c3c',
      withdrawn: '#7f8c8d'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading participants...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>
            <FaUsers style={{ marginRight: '15px' }} />
            Event Participants
          </h1>
          <h2 style={{ color: '#34495e', marginBottom: '20px' }}>{event.title}</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}>
                {applications.length}
              </div>
              <div style={{ color: '#6c757d' }}>Total Applications</div>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '10px' }}>
                {applications.filter(app => app.status === 'approved').length}
              </div>
              <div style={{ color: '#6c757d' }}>Approved</div>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#f39c12', marginBottom: '10px' }}>
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div style={{ color: '#6c757d' }}>Pending</div>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#e74c3c', marginBottom: '10px' }}>
                {applications.filter(app => app.status === 'rejected').length}
              </div>
              <div style={{ color: '#6c757d' }}>Rejected</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px 20px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <FaUsers style={{ fontSize: '3rem', color: '#bdc3c7', marginBottom: '20px' }} />
            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Applications Yet</h3>
            <p style={{ color: '#95a5a6' }}>This event hasn't received any applications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {applications.map((application) => (
              <div key={application._id} style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #ecf0f1'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#3498db',
                        color: 'white',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        <FaUser />
                      </div>
                      
                      <div>
                        <h3 style={{ 
                          margin: '0 0 5px 0', 
                          color: '#2c3e50',
                          fontSize: '1.3rem'
                        }}>
                          {application.student?.name}
                        </h3>
                        <div style={{ 
                          display: 'flex', 
                          gap: '20px', 
                          color: '#6c757d',
                          fontSize: '14px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaEnvelope />
                            {application.student?.email}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaPhone />
                            {application.student?.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                        <FaGraduationCap />
                        <span>Student ID: {application.student?.studentId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                        <FaBuilding />
                        <span>{application.student?.department}</span>
                      </div>
                      <div style={{ color: '#6c757d' }}>
                        Year: {application.student?.year}
                      </div>
                    </div>

                    {application.isTeamApplication && (
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                          Team: {application.teamName}
                        </h4>
                        <div style={{ display: 'grid', gap: '5px' }}>
                          {application.teamMembers?.map((member, index) => (
                            <div key={index} style={{ color: '#6c757d' }}>
                              • {member.name} {member.email && `(${member.email})`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {application.additionalInfo && (
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Additional Information</h4>
                        <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6' }}>
                          {application.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      <span>Applied on: {new Date(application.applicationDate).toLocaleDateString()}</span>
                      {application.reviewedAt && (
                        <span>• Reviewed on: {new Date(application.reviewedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '10px'
                  }}>
                    <span style={{
                      background: getStatusColor(application.status),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {application.status}
                    </span>
                    
                    {application.remarks && (
                      <div style={{ 
                        background: '#fff3cd', 
                        color: '#856404', 
                        padding: '10px', 
                        borderRadius: '8px',
                        fontSize: '14px',
                        maxWidth: '200px',
                        textAlign: 'center'
                      }}>
                        <strong>Remarks:</strong> {application.remarks}
                      </div>
                    )}
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

export default EventParticipants;
