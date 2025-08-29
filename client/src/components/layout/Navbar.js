import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCalendarAlt, FaHistory, FaUsers } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand" style={{
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '700',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
             Campus Events Portal
          </Link>
          
          <ul className="navbar-nav" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '1rem' }}>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: '500'
                  }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: '500'
                  }}>Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link to="/faculty-login" className="nav-link" style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: '500'
                  }}>Faculty Login</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link" style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: '500'
                  }}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/events" className="nav-link" style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: '500'
                  }}>Events</Link>
                </li>
                <li className="nav-item" style={{ position: 'relative' }} ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    style={{
                      background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <FaUser />
                    {user?.name}
                  </button>
                  
                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      borderRadius: '16px',
                      minWidth: '220px',
                      zIndex: 1000,
                      marginTop: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        padding: '1rem', 
                        borderBottom: '1px solid #e2e8f0',
                        background: 'linear-gradient(135deg, #475569 0%, #0d9488 100%)',
                        color: 'white'
                      }}>
                        <strong style={{ fontSize: '1.1rem' }}>{user?.name}</strong>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.25rem' }}>
                          {user?.userType === 'student' && `Student - ${user?.department}`}
                          {user?.userType === 'coordinator' && `Coordinator - ${user?.department}`}
                          {user?.userType === 'faculty' && 'Faculty Member'}
                        </div>
                      </div>
                      
                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 15px',
                          color: '#475569',
                          textDecoration: 'none',
                          borderBottom: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                          fontWeight: '500'
                        }}
                        onClick={() => setShowDropdown(false)}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <FaUser />
                        View Profile
                      </Link>
                      
                      {user?.userType === 'student' && (
                        <>
                          <Link
                            to="/my-applications"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaHistory />
                            My Applications
                          </Link>
                          <Link
                            to="/events"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaCalendarAlt />
                            Browse Events
                          </Link>
                        </>
                      )}
                      
                      {user?.userType === 'coordinator' && (
                        <>
                          <Link
                            to="/my-events"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaCalendarAlt />
                            My Events
                          </Link>
                          <Link
                            to="/create-event"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaCalendarAlt />
                            Create Event
                          </Link>
                        </>
                      )}
                      
                      {user?.userType === 'faculty' && (
                        <>
                          <Link
                            to="/events"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaCalendarAlt />
                            View Events
                          </Link>
                          <Link
                            to="/faculty/users"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#475569',
                              textDecoration: 'none',
                              borderBottom: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease-in-out',
                              fontWeight: '500'
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <FaUsers />
                            Manage Users
                          </Link>
                        </>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 15px',
                          color: '#dc3545',
                          textDecoration: 'none',
                          border: 'none',
                          background: 'none',
                          width: '100%',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
