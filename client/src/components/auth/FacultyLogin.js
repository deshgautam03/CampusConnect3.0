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
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '36px 0 20px 0'
      }}>
        <div className="container">
          <h2 style={{ margin: 0, fontWeight: 800 }}>Faculty Login</h2>
          <p style={{ margin: '6px 0 0 0', opacity: 0.9 }}>Access faculty dashboard and manage campus events</p>
        </div>
      </section>
      <div className="container" style={{ padding: '20px 0' }}>
        <div style={{ 
          maxWidth: '420px', 
          margin: '0 auto', 
          background: 'white', 
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(2,6,23,0.06)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Sign in</h3>
          </div>

          <div style={{ padding: '24px' }}>
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
                {loading ? 'Signing In...' : 'Faculty Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 15px 0', color: '#6c757d' }}>
                Not a faculty member?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/faculty-register" className="btn btn-primary" style={{ padding: '10px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #0f172a, #0d9488)', border: 'none' }}>
                  Create Faculty Account
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none' }}>
                  Student/Coordinator Login
                </Link>
                <Link to="/register" className="btn btn-outline" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '15px', background: '#f8fafc', borderRadius: '12px', fontSize: '14px', color: '#64748b', border: '1px solid #e2e8f0' }}>
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
