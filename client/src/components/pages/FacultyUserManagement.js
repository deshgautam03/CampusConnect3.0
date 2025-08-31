import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Toggle = ({ checked, onChange }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span>{checked ? 'Active' : 'Inactive'}</span>
  </label>
);

const FacultyUserManagement = () => {
  const [students, setStudents] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentEmails, setShowStudentEmails] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [studentEmails, setStudentEmails] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        axios.get('https://campusconnect3-0.onrender.com/api/users/students'),
        axios.get('https://campusconnect3-0.onrender.com/api/users/coordinators')
      ]);
      setStudents(s.data);
      setCoordinators(c.data);
    } catch (error) {
      toast.error('Error loading users');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, isActive) => {
    try {
      await axios.put(`https://campusconnect3-0.onrender.com/api/users/${id}/status`, { isActive });
      await load();
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Error updating user status');
    }
  };



  const saveStudentEmails = async (e) => {
    e.preventDefault();
    if (adminPassword !== 'Admin@123') {
      toast.error('Invalid admin password');
      return;
    }

    try {
      const emails = studentEmails.split('\n').map(email => email.trim()).filter(email => email);
      // Store emails in localStorage for now (in a real app, this would go to backend)
      localStorage.setItem('studentEmails', JSON.stringify(emails));
      toast.success(`${emails.length} student emails saved successfully`);
      setShowStudentEmails(false);
      setStudentEmails('');
      setAdminPassword('');
    } catch (error) {
      toast.error('Error saving student emails');
    }
  };

  const loadStudentEmails = () => {
    const saved = localStorage.getItem('studentEmails');
    if (saved) {
      setStudentEmails(JSON.parse(saved).join('\n'));
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const renderList = (items, title) => (
    <div style={{ marginBottom: 30 }}>
      <h3 style={{ marginBottom: 16, color: '#2c3e50' }}>{title}</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map(u => (
          <div key={u._id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            border: '1px solid #eee', 
            borderRadius: 8, 
            padding: 12, 
            background: 'white' 
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              <div style={{ color: '#6c757d', fontSize: 13 }}>{u.email}</div>
            </div>
            <Toggle checked={u.isActive} onChange={(v) => setStatus(u._id, v)} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px 0', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        <div style={{ 
          maxWidth: '1000px', 
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
              <FaUsers style={{ marginRight: '15px' }} />
              User Management
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: '0.9', fontSize: '1.1rem' }}>
              Manage students, coordinators, and faculty accounts
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '40px' }}>
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  setShowStudentEmails(true);
                  loadStudentEmails();
                }}
                style={{
                  padding: '12px 24px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px'
                }}
              >
                <FaEnvelope /> Manage Student Emails
              </button>
            </div>

            {/* User Lists */}
            {renderList(students, 'Students')}
            {renderList(coordinators, 'Coordinators')}
          </div>
        </div>



        {/* Student Emails Modal */}
        {showStudentEmails && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                <FaEnvelope style={{ marginRight: '10px' }} />
                Manage Student Emails
              </h2>
              
              <p style={{ marginBottom: '20px', color: '#6c757d' }}>
                Enter student emails (one per line) to receive notifications when events are created.
              </p>
              
              <form onSubmit={saveStudentEmails}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Admin Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FaLock style={{ 
                      position: 'absolute', 
                      left: '15px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6c757d' 
                    }} />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter Admin@123"
                      required
                      style={{
                        width: '100%',
                        padding: '15px 15px 15px 45px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Student Emails
                  </label>
                  <textarea
                    value={studentEmails}
                    onChange={(e) => setStudentEmails(e.target.value)}
                    placeholder="student1@campus.edu&#10;student2@campus.edu&#10;student3@campus.edu"
                    rows="8"
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

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowStudentEmails(false)}
                    style={{
                      padding: '12px 24px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Emails
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyUserManagement;