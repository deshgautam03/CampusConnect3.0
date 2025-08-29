import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    studentId: '',
    department: '',
    year: '',
    phone: '',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        phone: formData.phone,
        department: formData.department
      };

      if (formData.userType === 'student') {
        userData.studentId = formData.studentId;
        userData.year = parseInt(formData.year);
      }

      if (formData.userType === 'coordinator') {
        if (!formData.adminPassword) {
          toast.error('Admin password is required for coordinator registration');
          return;
        }
        userData.adminPassword = formData.adminPassword;
      }

      const result = await register(userData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to Campus Events Portal!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Arts & Humanities',
    'Science',
    'Medicine',
    'Law',
    'Other'
  ];

  const years = [1, 2, 3, 4, 5];

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #0d9488 100%)',
      padding: '20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`,
        opacity: 0.3
      }} />
      
      <div className="container">
        <div style={{ 
          maxWidth: '700px', 
          margin: '0 auto', 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #475569 0%, #0d9488 100%)', 
            color: 'white', 
            padding: '2rem', 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease-in-out'
            }} />
            <h2 style={{ 
              margin: '0', 
              fontSize: '2rem',
              fontWeight: '700',
              position: 'relative',
              zIndex: 1
            }}>Join Campus Events Portal</h2>
            <p style={{ 
              margin: '10px 0 0 0', 
              opacity: '0.9',
              fontSize: '1.1rem',
              position: 'relative',
              zIndex: 1
            }}>
              Create your account and start exploring exciting events
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password (min 6 characters)"
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">User Type *</label>
                    <select
                      name="userType"
                      className="form-select"
                      value={formData.userType}
                      onChange={handleChange}
                      required
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="coordinator">Event Coordinator</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>

              {formData.userType === 'coordinator' && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Admin Password *</label>
                      <input
                        type="password"
                        name="adminPassword"
                        className="form-control"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        required={formData.userType === 'coordinator'}
                        placeholder="Enter admin password"
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                      <small className="form-text text-muted">
                        Only authorized administrators can create coordinator accounts
                      </small>
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      style={{
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.userType === 'student' && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Student ID *</label>
                      <input
                        type="text"
                        name="studentId"
                        className="form-control"
                        value={formData.studentId}
                        onChange={handleChange}
                        required={formData.userType === 'student'}
                        placeholder="Enter your student ID"
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {formData.userType === 'student' && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Year of Study *</label>
                      <select
                        name="year"
                        className="form-select"
                        value={formData.year}
                        onChange={handleChange}
                        required={formData.userType === 'student'}
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year} Year</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '1.5rem',
                  padding: '0.875rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #475569 0%, #0d9488 100%)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e2e8f0' 
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.95rem' }}>
                Already have an account?
              </p>
              <Link to="/login" className="btn btn-outline" style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: '2px solid #475569',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                background: 'transparent'
              }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
