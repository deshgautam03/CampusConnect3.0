import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
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
          maxWidth: '450px', 
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
            }}>Welcome Back</h2>
            <p style={{ 
              margin: '10px 0 0 0', 
              opacity: '0.9',
              fontSize: '1.1rem',
              position: 'relative',
              zIndex: 1
            }}>
              Sign in to your Campus Events Portal account
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
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
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              </div>

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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e2e8f0' 
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.95rem' }}>
                Don't have an account?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-outline" style={{ 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #475569',
                  color: '#475569',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s ease-in-out',
                  background: 'transparent'
                }}>
                  Sign Up
                </Link>
                <Link to="/forgot-password" className="btn btn-outline" style={{ 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #f97316',
                  color: '#f97316',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s ease-in-out',
                  background: 'transparent'
                }}>
                  Forgot Password
                </Link>
                <Link to="/faculty-login" className="btn btn-outline" style={{ 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #0d9488',
                  color: '#0d9488',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s ease-in-out',
                  background: 'transparent'
                }}>
                  Faculty Login
                </Link>
              </div>
              <div style={{ marginTop: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b', border: '1px solid #e2e8f0' }}>
                <strong>Note:</strong> Students and Coordinators use this login. Faculty members must use the Faculty Login portal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
