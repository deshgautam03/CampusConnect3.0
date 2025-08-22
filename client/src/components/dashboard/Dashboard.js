import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaClipboardList, FaBell, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats and events based on user role
        if (user?.userType === 'faculty') {
          const eventsResponse = await axios.get('/api/events');
          setRecentEvents(eventsResponse.data.slice(0, 5));
          
          const statsResponse = await axios.get('/api/applications/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(statsResponse.data);
        } else if (user?.userType === 'coordinator') {
          try {
            console.log('Fetching coordinator events for user:', user.id);
            const myEventsResponse = await axios.get('/api/events/coordinator/my-events', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const events = myEventsResponse.data;
            console.log('Coordinator events received:', events);
            setRecentEvents(events.slice(0, 5)); // Show coordinator's last 5 events
            setStats({ totalEvents: events.length });
          } catch (error) {
            console.error('Error fetching coordinator events:', error);
            setRecentEvents([]);
            setStats({ totalEvents: 0 });
          }
        } else if (user?.userType === 'student') {
          const eventsResponse = await axios.get('/api/events');
          setRecentEvents(eventsResponse.data.slice(0, 5));
          
          const myApplicationsResponse = await axios.get('/api/applications/student/my-applications', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats({ totalApplications: myApplicationsResponse.data.length });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values to prevent crashes
        setStats({});
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const renderStudentDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Track your event applications and stay updated with campus events</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalApplications || 0}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-info">
            <h3>{recentEvents.length}</h3>
            <p>Available Events</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/events" className="btn btn-primary">
              <FaEye /> Browse Events
            </Link>
            <Link to="/my-applications" className="btn btn-secondary">
              <FaClipboardList /> My Applications
            </Link>
          </div>
        </div>

        <div className="section">
          <h2>Recent Events</h2>
          <div className="events-grid">
            {recentEvents.map(event => (
              <div key={event._id} className="event-card">
                <h3>{event.title}</h3>
                <p>{(event.description || event.shortDescription || '').substring(0, 100)}...</p>
                <div className="event-meta">
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  <span>{event.venue}</span>
                </div>
                <Link to={`/event/${event._id}`} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoordinatorDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Coordinator Dashboard</h1>
        <p>Manage your events and track participant applications</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>0</h3>
            <p>Total Participants</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/create-event" className="btn btn-primary">
              <FaPlus /> Create New Event
            </Link>
            <Link to="/my-events" className="btn btn-secondary">
              <FaCalendarAlt /> My Events
            </Link>
          </div>
        </div>

        <div className="section">
          <h2>My Events</h2>
          <div className="events-grid">
            {recentEvents.length > 0 ? (
              recentEvents.map(event => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p>{(event.description || event.shortDescription || '').substring(0, 100)}...</p>
                  <div className="event-meta">
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    <span>{event.venue}</span>
                  </div>
                  <div className="event-actions">
                    <Link to={`/event/${event._id}`} className="btn btn-outline">
                      <FaEye /> View Details
                    </Link>
                    <Link to={`/edit-event/${event._id}`} className="btn btn-secondary">
                      <FaEdit /> Edit Event
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px',
                color: '#6c757d'
              }}>
                <p>No events created yet. Create your first event to get started!</p>
                <Link to="/create-event" className="btn btn-primary">
                  <FaPlus /> Create Your First Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacultyDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Faculty Coordinator Dashboard</h1>
        <p>Monitor campus events, track participation, and manage users</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalParticipants || 0}</h3>
            <p>Total Participants</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalApplications || 0}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <FaBell className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.totalNotifications || 0}</h3>
            <p>Notifications Sent</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/faculty/users" className="btn btn-primary">
              <FaUsers /> Manage Users
            </Link>
            <Link to="/events" className="btn btn-secondary">
              <FaCalendarAlt /> View All Events
            </Link>
          </div>
        </div>

        <div className="section">
          <h2>Recent Events</h2>
          <div className="events-grid">
            {recentEvents.map(event => (
              <div key={event._id} className="event-card">
                <h3>{event.title}</h3>
                <p>{(event.description || event.shortDescription || '').substring(0, 100)}...</p>
                <div className="event-meta">
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  <span>{event.venue}</span>
                </div>
                <div className="event-actions">
                  <Link to={`/event/${event._id}`} className="btn btn-outline">
                    <FaEye /> View Details
                  </Link>
                  <Link to={`/event-participants/${event._id}`} className="btn btn-secondary">
                    <FaUsers /> View Participants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {user?.userType === 'student' && renderStudentDashboard()}
      {user?.userType === 'coordinator' && renderCoordinatorDashboard()}
      {user?.userType === 'faculty' && renderFacultyDashboard()}
    </div>
  );
};

export default Dashboard;
