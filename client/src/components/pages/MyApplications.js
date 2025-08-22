import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const StatusBadge = ({ status }) => {
  const color = {
    pending: '#f39c12',
    approved: '#27ae60',
    rejected: '#e74c3c',
    withdrawn: '#7f8c8d'
  }[status] || '#95a5a6';
  return (
    <span style={{
      background: color,
      color: 'white',
      padding: '4px 10px',
      borderRadius: 12,
      fontSize: 12,
      textTransform: 'uppercase'
    }}>{status}</span>
  );
};

const MyApplications = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/applications/student/my-applications');
        setItems(res.data);
      } catch (_) {}
      setLoading(false);
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h2 style={{ marginBottom: 16 }}>My Applications</h2>
      {items.length === 0 && <p>No applications yet.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(app => (
          <div key={app._id} style={{
            border: '1px solid #eee', borderRadius: 8, padding: 16, background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{app.event?.title}</div>
                <div style={{ color: '#6c757d', fontSize: 13 }}>
                  Applied on {new Date(app.applicationDate).toLocaleDateString()}
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;


