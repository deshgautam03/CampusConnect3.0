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
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '10px', color: '#64748b' }}>Loading events...</p>
      </div>
    );
  }

  const categories = Array.from(
    new Set(events.map(e => e.category).filter(Boolean))
  ).slice(0, 8);

  const totalParticipants = events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0);

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          background: 'radial-gradient(1200px 600px at 10% -10%, rgba(13,148,136,0.25), transparent), radial-gradient(1200px 600px at 90% 10%, rgba(249,115,22,0.25), transparent), linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
          color: 'white',
          padding: '88px 0 56px 0',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="col-md-7" style={{ textAlign: 'left' }}>
              <h1 style={{
                fontSize: '3rem',
                lineHeight: 1.15,
                marginBottom: '1rem',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Campus Events Portal
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '640px',
                marginBottom: '1.5rem'
              }}>
                Explore tech talks, cultural fests, sports meets, and workshops across campus. Find your next opportunity to shine.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to="/events"
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #f97316, #fdba74)',
                    borderRadius: '12px',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 10px 25px rgba(249,115,22,0.35)'
                  }}
                >
                  Browse Events
                </Link>
                <a
                  href="#featured"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.25)'
                  }}
                >
                  See Highlights
                </a>
              </div>
            </div>
            <div className="col-md-5" style={{ textAlign: 'center', marginTop: '20px' }}>
              {/* <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px',
                padding: '16px 18px'
              }}> */}
                {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{events.length}</div>
                    <div style={{ opacity: 0.85 }}>Upcoming</div>
                  </div>
                  <div style={{ textAlign: 'center' }}> */}
                    {/* <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalParticipants}</div>
                    <div style={{ opacity: 0.85 }}>Participants</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{categories.length}</div>
                    <div style={{ opacity: 0.85 }}>Categories</div>
                  </div> */}
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ background: 'white', padding: '18px 0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <span key={cat} style={{
                padding: '8px 14px',
                background: '#f1f5f9',
                color: '#0f172a',
                borderRadius: '999px',
                border: '1px solid #e2e8f0',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {cat}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section id="featured" style={{ padding: '56px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>Featured Events</h2>
            <p style={{ color: '#64748b', margin: 0 }}>Handpicked highlights happening soon</p>
          </div>

          <div className="row">
            {events.slice(0, 6).map((event) => (
              <div key={event._id} className="col-md-4" style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 20px rgba(2,6,23,0.06)'
                }}>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '10px'
                    }}>
                      {event.category}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>{event.title}</h3>
                    <p style={{ color: '#475569', marginTop: '8px', marginBottom: '12px', lineHeight: 1.5 }}>
                      {event.shortDescription}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', color: '#475569', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt /> {formatDate(event.startDate)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <FaMapMarkerAlt /> {event.venue}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaUsers /> {(event.currentParticipants || 0)}/{event.maxParticipants}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <FaClock /> {event.entryFee > 0 ? `$${event.entryFee}` : 'Free'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/event/${event._id}`} style={{
                        flex: 1,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 700,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #0f172a, #0d9488)'
                      }}>
                        <FaEye style={{ marginRight: '6px' }} /> View
                      </Link>
                      <Link to={`/event-participants/${event._id}`} style={{
                        flex: 1,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: '#0f172a',
                        fontWeight: 700,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                      }}>
                        <FaUsers style={{ marginRight: '6px' }} /> Participants
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <Link to="/events" style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #475569, #0d9488)',
              borderRadius: '12px',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(2,6,23,0.15)'
            }}>
              Browse all events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '40px 0', background: 'linear-gradient(90deg, #0ea5e9, #22d3ee)', color: 'white' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800 }}>Want to host an event?</h3>
            <p style={{ margin: 0, opacity: 0.95 }}>Coordinators can create and manage events in minutes.</p>
          </div>
          <Link to="/create-event" style={{
            padding: '10px 16px',
            background: 'white',
            color: '#0f172a',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 800
          }}>
            Create event
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ opacity: 0.9 }}>© {new Date().getFullYear()} CampusConnect</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="mailto:deshgautam03@gmail.com" style={{ color: 'white', textDecoration: 'none' }}><FaEnvelope /> <span style={{ marginLeft: 6 }}>Email</span></a>
            <a href="tel:+919027680644" style={{ color: 'white', textDecoration: 'none' }}><FaPhone /> <span style={{ marginLeft: 6 }}>Call</span></a>
            <a href="https://www.linkedin.com/in/desh-deepak-gautam-a68a6a235?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}><FaLinkedin /> <span style={{ marginLeft: 6 }}>LinkedIn</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
