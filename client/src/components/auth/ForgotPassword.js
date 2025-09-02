import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP and password
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'OTP has been sent to your email!');
        setStep(2);
      } else if (res.status === 404) {
        toast.error('Email not registered');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (_) {
      toast.error('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'New OTP has been sent to your email!');
        setOtp('');
      } else if (res.status === 404) {
        toast.error('Email not registered');
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (_) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful! You can now login with your new password.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (_) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
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
          maxWidth: '500px', 
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
            <h2 style={{ margin: 0, fontSize: '1.875rem', fontWeight: '700', position: 'relative', zIndex: 1 }}>
              {step === 1 ? '🔐 Forgot Password' : '🔑 Reset Password'}
            </h2>
            <p style={{ 
              margin: '0.75rem 0 0 0', 
              opacity: 0.9, 
              fontSize: '1rem',
              position: 'relative',
              zIndex: 1
            }}>
              {step === 1 ? 'Enter your registered email to receive an OTP' : 'Enter OTP and create new password'}
            </p>
          </div>
          <div style={{ padding: '2rem' }}>
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="fade-in">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email address" 
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
                    marginTop: '1rem',
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
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="slide-up">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    disabled 
                    style={{ 
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      color: '#64748b'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">OTP Code</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      maxLength="6"
                      style={{ 
                        flex: 1,
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        textAlign: 'center',
                        letterSpacing: '0.25em',
                        fontWeight: '600',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={handleResendOTP}
                      disabled={loading}
                      style={{
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f97316 0%, #fdba74 100%)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Resend
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    required 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password (min 6 characters)"
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
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
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
                    marginTop: '1rem',
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #475569 0%, #0d9488 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }} 
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button 
                  type="button" 
                  onClick={handleBackToEmail}
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '2px solid #475569',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Back to Email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


