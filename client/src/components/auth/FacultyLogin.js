import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const FacultyLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { facultyLogin } = useAuth();
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

    try {
      const result = await facultyLogin(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Faculty login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
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
          maxWidth: '400px', 
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
            <h2 style={{ margin: '0', fontSize: '2rem' }}>Faculty Login</h2>
            <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
              Access faculty dashboard and manage campus events
            </p>
          </div>

          <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Faculty Email</label>
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
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px' }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Faculty Sign In'}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '30px', 
              paddingTop: '20px', 
              borderTop: '1px solid #eee' 
            }}>
              <p style={{ margin: '0 0 15px 0', color: '#6c757d' }}>
                Not a faculty member?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/faculty-register" className="btn btn-primary">
                  Create Faculty Account
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Student/Coordinator Login
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Sign Up
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
              <strong>Note:</strong> Faculty accounts are pre-configured by the system administrator. 
              If you need access, please contact your department head.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;
