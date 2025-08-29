import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful. You can now login.');
        setForm({ email: '', otp: '', newPassword: '' });
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (_) {
      toast.error('Failed to reset password');
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
          <h2 style={{ margin: 0, fontWeight: 800 }}>Reset Password</h2>
          <p style={{ margin: '6px 0 0 0', opacity: 0.9 }}>Enter your email, OTP and new password</p>
        </div>
      </section>
      <div className="container" style={{ padding: '20px 0' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 10px 20px rgba(2,6,23,0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>Reset Password</div>
          <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" required value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">OTP</label>
                <input type="text" name="otp" className="form-control" required value={form.otp} onChange={handleChange} placeholder="6-digit OTP" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" name="newPassword" className="form-control" required value={form.newPassword} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '10px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #0f172a, #0d9488)', border: 'none', color: 'white', fontWeight: 700 }} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


