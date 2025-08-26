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
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">
             Campus Events Portal
          </Link>
          
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link to="/faculty-login" className="nav-link">Faculty Login</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/events" className="nav-link">Events</Link>
                </li>
                <li className="nav-item" style={{ position: 'relative' }} ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#6c757d',
                      fontSize: '16px',
                      fontWeight: '500'
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
                      background: 'white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      minWidth: '200px',
                      zIndex: 1000,
                      marginTop: '10px'
                    }}>
                      <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                        <strong>{user?.name}</strong>
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
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
                          color: '#333',
                          textDecoration: 'none',
                          borderBottom: '1px solid #eee'
                        }}
                        onClick={() => setShowDropdown(false)}
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaCalendarAlt />
                            Browse Events
                          </Link>
                          <Link
                            to="/my-applications"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaUsers />
                            View My Applications
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
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
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaUsers />
                            Manage Users
                          </Link>
                          <Link
                            to="/events"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '12px 15px',
                              color: '#333',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee'
                            }}
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaUsers />
                            View All Events
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
                          fontSize: '16px'
                        }}
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
