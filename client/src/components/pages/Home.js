import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaEye, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use demo events if API fails
        setEvents(getDemoEvents());
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getDemoEvents = () => [
    {
      _id: '1',
      title: 'Tech Innovation Hackathon 2024',
      shortDescription: 'Join us for a 24-hour coding challenge where creativity meets technology. Build innovative solutions and win exciting prizes!',
      category: 'Technical',
      startDate: '2024-03-15T09:00:00.000Z',
      endDate: '2024-03-16T09:00:00.000Z',
      venue: 'Computer Science Lab, Block A',
      maxParticipants: 50,
      currentParticipants: 23,
      entryFee: 0,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop'
    },
    {
      _id: '2',
      title: 'Cultural Fest - Harmony 2024',
      shortDescription: 'Experience the rich diversity of cultures through music, dance, art, and performances from around the world.',
      category: 'Cultural',
      startDate: '2024-03-20T18:00:00.000Z',
      endDate: '2024-03-22T22:00:00.000Z',
      venue: 'Main Auditorium & Campus Grounds',
      maxParticipants: 200,
      currentParticipants: 156,
      entryFee: 100,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop'
    },
    {
      _id: '3',
      title: 'Sports Meet - Champions League',
      shortDescription: 'Compete in various sports including football, basketball, cricket, and athletics. Show your athletic prowess!',
      category: 'Sports',
      startDate: '2024-03-25T08:00:00.000Z',
      endDate: '2024-03-27T18:00:00.000Z',
      venue: 'Sports Complex & Grounds',
      maxParticipants: 150,
      currentParticipants: 89,
      entryFee: 50,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'
    },
    {
      _id: '4',
      title: 'AI & Machine Learning Workshop',
      shortDescription: 'Learn the fundamentals of AI and ML through hands-on projects and expert-led sessions.',
      category: 'Workshop',
      startDate: '2024-04-01T10:00:00.000Z',
      endDate: '2024-04-01T16:00:00.000Z',
      venue: 'Conference Room, Engineering Block',
      maxParticipants: 30,
      currentParticipants: 18,
      entryFee: 200,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
    },
    {
      _id: '5',
      title: 'Business Plan Competition',
      shortDescription: 'Pitch your innovative business ideas to industry experts and investors. Win funding and mentorship opportunities.',
      category: 'Academic',
      startDate: '2024-04-10T14:00:00.000Z',
      endDate: '2024-04-10T18:00:00.000Z',
      venue: 'Business School Auditorium',
      maxParticipants: 25,
      currentParticipants: 12,
      entryFee: 0,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop'
    },
    {
      _id: '6',
      title: 'Photography Exhibition',
      shortDescription: 'Showcase your photography skills and get inspired by amazing works from fellow students.',
      category: 'Cultural',
      startDate: '2024-04-15T11:00:00.000Z',
      endDate: '2024-04-17T19:00:00.000Z',
      venue: 'Art Gallery, Humanities Block',
      maxParticipants: 40,
      currentParticipants: 28,
      entryFee: 75,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to Campus Events Portal</h1>
          <p>Discover exciting events, workshops, and activities happening on campus</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#2c3e50' }}>
                About Campus Events Portal
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#6c757d', marginBottom: '20px' }}>
                Our platform connects students, coordinators, and faculty members to create, discover, and participate in 
                exciting campus events. From technical workshops to cultural festivals, sports competitions to academic seminars, 
                we provide a comprehensive solution for event management and participation.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#6c757d', marginBottom: '30px' }}>
                Whether you're a student looking to showcase your talents, a coordinator planning the next big event, 
                or faculty member overseeing campus activities, our portal has everything you need.
              </p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Link to="/events" className="btn btn-primary">
                  Browse Events
                </Link>
              </div>
            </div>
            <div className="col-md-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '40px', 
                borderRadius: '20px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ marginBottom: '20px' }}>Why Choose Us?</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>🎯 Easy Event Discovery</div>
                  <div>📧 Instant Notifications</div>
                  <div>🔒 Secure Applications</div>
                  <div>📊 Real-time Analytics</div>
                  <div>📱 Mobile Friendly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section style={{ padding: '60px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#2c3e50' }}>
              Featured Events
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
              Explore upcoming events and find your next adventure
            </p>
          </div>

          <div className="row">
            {events.map((event) => (
              <div key={event._id} className="col-md-4">
                <div className="event-card">
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="event-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="event-content">
                    <div className="event-category">{event.category}</div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.shortDescription}</p>
                    
                    <div className="event-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCalendarAlt />
                        {formatDate(event.startDate)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaMapMarkerAlt />
                        {event.venue}
                      </div>
                    </div>
                    
                    <div className="event-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaUsers />
                        {event.currentParticipants}/{event.maxParticipants}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaClock />
                        {event.entryFee > 0 ? `$${event.entryFee}` : 'Free'}
                      </div>
                    </div>
                    
                    <div className="event-actions">
                      <Link to={`/event/${event._id}`} className="btn btn-primary">
                        <FaEye style={{ marginRight: '5px' }} />
                        View Event
                      </Link>
                      <Link to={`/event-participants/${event._id}`} className="btn btn-secondary">
                        <FaUsers style={{ marginRight: '5px' }} />
                        View Participants
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '40px 0 20px 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ marginBottom: '20px', color: '#ecf0f1' }}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaEnvelope style={{ color: '#3498db', fontSize: '18px' }} />
                  <a 
                    href="mailto:deshgautam03@gmail.com" 
                    style={{ color: '#ecf0f1', textDecoration: 'none' }}
                    onMouseOver={(e) => e.target.style.color = '#3498db'}
                    onMouseOut={(e) => e.target.style.color = '#ecf0f1'}
                  >
                    deshgautam03@gmail.com
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaPhone style={{ color: '#3498db', fontSize: '18px' }} />
                  <a 
                    href="tel:+919027680644" 
                    style={{ color: '#ecf0f1', textDecoration: 'none' }}
                    onMouseOver={(e) => e.target.style.color = '#3498db'}
                    onMouseOut={(e) => e.target.style.color = '#ecf0f1'}
                  >
                    +91 9027680644
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaLinkedin style={{ color: '#3498db', fontSize: '18px' }} />
                  <a 
                    href="https://www.linkedin.com/in/desh-deepak-gautam-a68a6a235?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#ecf0f1', textDecoration: 'none' }}
                    onMouseOver={(e) => e.target.style.color = '#3498db'}
                    onMouseOut={(e) => e.target.style.color = '#ecf0f1'}
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h4 style={{ marginBottom: '20px', color: '#ecf0f1' }}>About CampusConnect</h4>
              <p style={{ color: '#bdc3c7', lineHeight: '1.6' }}>
                CampusConnect is a comprehensive event management platform designed to streamline 
                campus events, facilitate student participation, and enhance coordination between 
                students, coordinators, and faculty members.
              </p>
            </div>
          </div>
          <hr style={{ borderColor: '#34495e', margin: '30px 0 20px 0' }} />
          <div style={{ 
            textAlign: 'center', 
            color: '#bdc3c7', 
            fontSize: '14px' 
          }}>
            <p style={{ margin: '0' }}>
              © {new Date().getFullYear()} CampusConnect. All rights reserved. | 
              Developed by Desh Deepak Gautam
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
