import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="alert alert-danger">
          <h3>Access Denied</h3>
          <p>You don't have permission to access this page.</p>
          <p>Required role: {allowedRoles.join(' or ')}</p>
          <p>Your role: {user?.userType}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
