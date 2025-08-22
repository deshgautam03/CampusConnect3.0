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
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      padding: '20px 0'
    }}>
      <div className="container">
        <div style={{ 
          maxWidth: '500px', 
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
            <h2 style={{ margin: '0', fontSize: '2rem' }}>Create Faculty Account</h2>
            <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
              Register as a faculty member to manage campus events
            </p>
          </div>

          <div style={{ padding: '30px' }}>
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
                style={{ width: '100%', marginTop: '20px' }}
                disabled={loading}
              >
                <FaUserPlus style={{ marginRight: '8px' }} />
                {loading ? 'Creating Account...' : 'Create Faculty Account'}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '30px', 
              paddingTop: '20px', 
              borderTop: '1px solid #eee' 
            }}>
              <p style={{ margin: '0 0 15px 0', color: '#6c757d' }}>
                Already have an account?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/faculty-login" className="btn btn-outline">
                  Faculty Login
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Student/Coordinator Login
                </Link>
              </div>
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6c757d'
            }}>
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
