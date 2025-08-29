import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUserGraduate, FaEnvelope, FaPhone, FaBuilding, FaLock, FaUserPlus } from 'react-icons/fa';

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    designation: '',
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
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: 'faculty',
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        adminPassword: formData.adminPassword
      };

      const result = await register(userData);
      
      if (result.success) {
        toast.success('Faculty account created successfully!');
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

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '36px 0 20px 0'
      }}>
        <div className="container">
          <h2 style={{ margin: 0, fontWeight: 800 }}>Create Faculty Account</h2>
          <p style={{ margin: '6px 0 0 0', opacity: 0.9 }}>Register as a faculty member to manage campus events</p>
        </div>
      </section>
      <div className="container" style={{ padding: '20px 0' }}>
        <div style={{ 
          maxWidth: '520px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(2,6,23,0.06)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Sign up</h3>
          </div>

          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FaUserGraduate style={{ marginRight: '8px' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope style={{ marginRight: '8px' }} />
                  Faculty Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your faculty email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaPhone style={{ marginRight: '8px' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaBuilding style={{ marginRight: '8px' }} />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="Enter your department"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaUserGraduate style={{ marginRight: '8px' }} />
                  Designation
                </label>
                <select
                  name="designation"
                  className="form-control"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Head of Department">Head of Department</option>
                  <option value="Dean">Dean</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: '8px' }} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password (min 6 characters)"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: '8px' }} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: '8px' }} />
                  Admin Password
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  className="form-control"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin password to authorize faculty account creation"
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Only authorized administrators can create faculty accounts
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '12px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700
                }}
                disabled={loading}
              >
                <FaUserPlus style={{ marginRight: '8px' }} />
                {loading ? 'Creating Account...' : 'Create Faculty Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 15px 0', color: '#6c757d' }}>
                Already have an account?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/faculty-login" className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none' }}>
                  Faculty Login
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none' }}>
                  Student/Coordinator Login
                </Link>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '15px', background: '#f8fafc', borderRadius: '12px', fontSize: '14px', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <strong>Note:</strong> Faculty accounts have administrative privileges to manage users, 
              view all events, and monitor campus activities. Please ensure you have proper authorization 
              to create a faculty account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegister;
