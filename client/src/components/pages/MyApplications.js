import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendar, FaUser, FaTimes, FaCheck, FaExclamationTriangle, FaUsers } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const color = {
    pending: '#f39c12',
    approved: '#27ae60',
    rejected: '#e74c3c',
    withdrawn: '#7f8c8d'
  }[status] || '#95a5a6';
  
  const icon = {
    pending: <FaCalendar />,
    approved: <FaCheck />,
    rejected: <FaTimes />,
    withdrawn: <FaExclamationTriangle />
  }[status] || <FaCalendar />;

  return (
    <span style={{
      background: color,
      color: 'white',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      textTransform: 'uppercase',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      {icon} {status}
    </span>
  );
};

const MyApplications = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://campusconnect3-0.onrender.com/api/applications/student/my-applications');
        setItems(res.data);
      } catch (_) {}
      setLoading(false);
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '36px 0 20px 0'
      }}>
        <div className="container">
          <h2 style={{ margin: 0, fontWeight: 800 }}>My Applications</h2>
        </div>
      </section>
      <div className="container" style={{ padding: '24px 0' }}>
      {items.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6c757d', fontSize: '16px' }}>No applications yet.</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: 16 }}>
        {items.map(app => (
          <div key={app._id} style={{
            border: '1px solid #e2e8f0', 
            borderRadius: 16, 
            padding: 20, 
            background: 'white',
            boxShadow: '0 10px 20px rgba(2,6,23,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#0f172a',
                  fontSize: '18px'
                }}>
                  {app.event?.title}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: 20, 
                  color: '#64748b', 
                  fontSize: 14,
                  marginBottom: 12
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaCalendar />
                    Applied on {new Date(app.applicationDate).toLocaleDateString()}
                  </span>
                  {app.reviewedAt && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUser />
                      Reviewed on {new Date(app.reviewedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Show team information if team application */}
                {app.isTeamApplication && (
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '6px' }}>
                      Team: {app.teamName}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6c757d' }}>
                      Members: {app.teamMembers?.join(', ')}
                    </div>
                  </div>
                )}

                {/* Show additional info if provided */}
                {app.additionalInfo && (
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '12px', 
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '6px' }}>
                      Additional Information:
                    </div>
                    <div style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.5' }}>
                      {app.additionalInfo}
                    </div>
                  </div>
                )}

                {/* Show rejection reason if rejected */}
                {app.status === 'rejected' && app.rejectionReason && (
                  <div style={{ 
                    background: '#f8d7da', 
                    color: '#721c24', 
                    padding: '12px', 
                    borderRadius: '12px',
                    border: '1px solid #f5c6cb',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>
                      Rejection Reason:
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {app.rejectionReason}
                    </div>
                  </div>
                )}

                {/* Show remarks if any */}
                {app.remarks && (
                  <div style={{ 
                    background: '#fff3cd', 
                    color: '#856404', 
                    padding: '12px', 
                    borderRadius: '12px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>
                      Remarks:
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {app.remarks}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <StatusBadge status={app.status} />
                
                {/* View Participants Button */}
                <Link
                  to={`/event-participants/${app.event._id}`}
                  style={{
                    background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <FaUsers />
                  View Participants
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default MyApplications;


