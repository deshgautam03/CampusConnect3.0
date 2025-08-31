import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaCheck, FaTimes, FaUndo, FaPrint } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const EventParticipants = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes] = await Promise.all([
          axios.get(`https://campusconnect3-0.onrender.com/api/events/${id}`)
        ]);
        setEvent(eventRes.data);
        
        // Use different endpoints based on user role
        let applicationsRes;
        if (user?.userType === 'student') {
          // Students can only see approved participants with limited info
          applicationsRes = await axios.get(`https://campusconnect3-0.onrender.com/api/applications/event/${id}/participants`);
        } else {
          // Faculty and coordinators can see all applications with full info
          applicationsRes = await axios.get(`https://campusconnect3-0.onrender.com/api/applications/event/${id}`);
        }
        
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.userType]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      approved: '#27ae60',
      rejected: '#e74c3c',
      withdrawn: '#7f8c8d'
    };
    return colors[status] || '#95a5a6';
  };

  const handleStatusUpdate = async (applicationId, newStatus, remarks = '') => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const response = await axios.put(`https://campusconnect3-0.onrender.com/api/applications/${applicationId}/status`, {
        status: newStatus,
        remarks
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, ...response.data } : app
      ));
      
      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating application status';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || !adminPassword) {
      toast.error('Please provide both rejection reason and admin password');
      return;
    }

    if (adminPassword !== 'Admin@123') {
      toast.error('Invalid admin password');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`https://campusconnect3-0.onrender.com/api/applications/${selectedApplication._id}/status`, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        adminPassword: adminPassword
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === selectedApplication._id ? { ...app, ...response.data } : app
      ));
      
      toast.success('Application rejected successfully');
      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason('');
      setAdminPassword('');
    } catch (error) {
      const message = error.response?.data?.message || 'Error rejecting application';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleApproveRejected = async () => {
    if (!adminPassword) {
      toast.error('Please provide admin password');
      return;
    }

    if (adminPassword !== 'Admin@123') {
      toast.error('Invalid admin password');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`https://campusconnect3-0.onrender.com/api/applications/${selectedApplication._id}/approve-rejected`, {
        adminPassword: adminPassword,
        remarks: approvalRemarks
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === selectedApplication._id ? { ...app, ...response.data } : app
      ));
      
      toast.success('Application approved successfully');
      setShowApproveModal(false);
      setSelectedApplication(null);
      setAdminPassword('');
      setApprovalRemarks('');
    } catch (error) {
      const message = error.response?.data?.message || 'Error approving application';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const openRejectModal = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const openApproveModal = (application) => {
    setSelectedApplication(application);
    setShowApproveModal(true);
  };

  const canApprove = user?.userType === 'coordinator';
  const canReject = user?.userType === 'faculty' || user?.userType === 'coordinator';

  const handlePrint = (approvedOnly = false) => {
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent(approvedOnly);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Participants - ${event?.title}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .print-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .print-subtitle { font-size: 16px; color: #666; margin-bottom: 20px; }
              .print-info { margin-bottom: 30px; }
              .print-info table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .print-info td { padding: 8px; border: 1px solid #ddd; }
              .print-info td:first-child { font-weight: bold; background-color: #f5f5f5; }
              .participants-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .participants-table th, .participants-table td { 
                border: 1px solid #ddd; 
                padding: 12px; 
                text-align: left; 
                font-size: 12px;
              }
              .participants-table th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
                font-size: 13px;
              }
              .status-approved { color: #27ae60; font-weight: bold; }
              .status-pending { color: #f39c12; font-weight: bold; }
              .status-rejected { color: #e74c3c; font-weight: bold; }
              .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
              .no-print { display: none; }
            }
            @media screen {
              body { font-family: Arial, sans-serif; padding: 20px; }
              .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .print-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .print-subtitle { font-size: 16px; color: #666; margin-bottom: 20px; }
              .print-info { margin-bottom: 30px; }
              .print-info table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .print-info td { padding: 8px; border: 1px solid #ddd; }
              .print-info td:first-child { font-weight: bold; background-color: #f5f5f5; }
              .participants-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .participants-table th, .participants-table td { 
                border: 1px solid #ddd; 
                padding: 12px; 
                text-align: left; 
                font-size: 12px;
              }
              .participants-table th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
                font-size: 13px;
              }
              .status-approved { color: #27ae60; font-weight: bold; }
              .status-pending { color: #f39c12; font-weight: bold; }
              .status-rejected { color: #e74c3c; font-weight: bold; }
              .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
              .no-print { display: block; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const generatePrintContent = (approvedOnly = false) => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const filteredApplications = approvedOnly 
      ? applications.filter(app => app.status === 'approved')
      : applications;
    
    return `
      <div class="print-header">
        <div class="print-title">Event Participants Report</div>
        <div class="print-subtitle">${event?.title}</div>
        <div>${approvedOnly ? 'Approved Participants Only' : 'All Applications'}</div>
        <div>Generated on: ${currentDate} at ${currentTime}</div>
      </div>

      <div class="print-info">
        <table>
          <tr>
            <td>Event Title</td>
            <td>${event?.title}</td>
          </tr>
          <tr>
            <td>Event Date</td>
            <td>${event?.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'} - ${event?.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}</td>
          </tr>
          <tr>
            <td>Venue</td>
            <td>${event?.venue || 'N/A'}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${event?.category || 'N/A'}</td>
          </tr>
          <tr>
            <td>Total Applications</td>
            <td>${approvedOnly ? filteredApplications.length : applications.length}</td>
          </tr>
          <tr>
            <td>Approved Participants</td>
            <td>${applications.filter(app => app.status === 'approved').length}</td>
          </tr>
          {!approvedOnly && (
            <>
              <tr>
                <td>Pending Applications</td>
                <td>${applications.filter(app => app.status === 'pending').length}</td>
              </tr>
              <tr>
                <td>Rejected Applications</td>
                <td>${applications.filter(app => app.status === 'rejected').length}</td>
              </tr>
            </>
          )}
        </table>
      </div>

      <table class="participants-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Student ID</th>
            <th>Department</th>
            <th>Year</th>
            <th>Status</th>
            <th>Application Date</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${filteredApplications.map((application, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${application.student?.name || 'N/A'}</td>
              <td>${application.student?.email || 'N/A'}</td>
              <td>${application.student?.phone || 'N/A'}</td>
              <td>${application.student?.studentId || 'N/A'}</td>
              <td>${application.student?.department || 'N/A'}</td>
              <td>${application.student?.year || 'N/A'}</td>
              <td class="status-${application.status}">${application.status.toUpperCase()}</td>
              <td>${new Date(application.applicationDate).toLocaleDateString()}</td>
              <td>${application.remarks || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="print-footer">
        <p>This report was generated by ${user?.name} (${user?.userType}) on ${currentDate} at ${currentTime}</p>
        <p>Campus Events Portal - Event Management System</p>
      </div>
    `;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div className="spinner"></div>
        <p>Loading participants...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0d9488 100%)',
        color: 'white',
        padding: '36px 0 20px 0'
      }}>
        <div className="container">
          <h1 style={{ marginBottom: '6px' }}>
            <FaUsers style={{ marginRight: '10px' }} /> Event Participants
          </h1>
          <h2 style={{ margin: 0, opacity: 0.9 }}>{event.title}</h2>
        </div>
      </section>
      <div className="container" style={{ padding: '20px 0' }}>
        
        {user?.userType !== 'student' && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              onClick={() => handlePrint(false)}
              style={{
                background: 'linear-gradient(135deg, #0f172a, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <FaPrint /> Print All
            </button>
            <button
              onClick={() => handlePrint(true)}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <FaPrint /> Print Approved Only
            </button>
          </div>
        )}

        
        {user?.userType !== 'student' && (
          <div style={{ 
            background: '#e8f5e8', 
            border: '1px solid #27ae60', 
            borderRadius: '8px', 
            padding: '15px', 
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ 
              background: '#16a34a', 
              color: 'white', 
              padding: '5px 10px', 
              borderRadius: '999px', 
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {user?.userType === 'faculty' ? 'Faculty' : 'Coordinator'}
            </div>
            <span style={{ color: '#2c3e50', fontSize: '14px' }}>
              {user?.userType === 'faculty' 
                ? 'You can only reject applications. Contact coordinators for approvals.' 
                : 'You can approve or reject applications for this event.'
              }
            </span>
          </div>
        )}
          
          {user?.userType === 'student' && (
            <div style={{ 
              background: '#e3f2fd', 
              border: '1px solid #2196f3', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ 
                background: '#2196f3', 
                color: 'white', 
                padding: '5px 10px', 
                borderRadius: '15px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Student
              </div>
              <span style={{ color: '#2c3e50', fontSize: '14px' }}>
                Viewing approved participants for this event.
              </span>
            </div>
          )}
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {user?.userType === 'student' ? (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '10px' }}>
                  {applications.length}
                </div>
                <div style={{ color: '#6c757d' }}>Approved Participants</div>
              </div>
            ) : (
              <>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}>
                    {applications.length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Total Applications</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '10px' }}>
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Approved</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', color: '#f39c12', marginBottom: '10px' }}>
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Pending</div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', color: '#e74c3c', marginBottom: '10px' }}>
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div style={{ color: '#6c757d' }}>Rejected</div>
                </div>
              </>
            )}
          </div>
        
        {applications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px 20px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <FaUsers style={{ fontSize: '3rem', color: '#bdc3c7', marginBottom: '20px' }} />
            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
              {user?.userType === 'student' ? 'No Approved Participants Yet' : 'No Applications Yet'}
            </h3>
            <p style={{ color: '#95a5a6' }}>
              {user?.userType === 'student' 
                ? 'This event doesn\'t have any approved participants yet.' 
                : 'This event hasn\'t received any applications yet.'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {applications.map((application) => (
              <div key={application._id} style={{
                background: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #ecf0f1'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#3498db',
                        color: 'white',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        <FaUser />
                      </div>
                      
                      <div>
                        <h3 style={{ 
                          margin: '0 0 5px 0', 
                          color: '#2c3e50',
                          fontSize: '1.3rem'
                        }}>
                          {application.student?.name}
                        </h3>
                        {user?.userType !== 'student' && (
                          <div style={{ 
                            display: 'flex', 
                            gap: '20px', 
                            color: '#6c757d',
                            fontSize: '14px'
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <FaEnvelope />
                              {application.student?.email}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <FaPhone />
                              {application.student?.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                        <FaGraduationCap />
                        <span>Student ID: {application.student?.studentId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                        <FaBuilding />
                        <span>{application.student?.department}</span>
                      </div>
                      <div style={{ color: '#6c757d' }}>
                        Year: {application.student?.year}
                      </div>
                    </div>

                    {user?.userType !== 'student' && application.isTeamApplication && (
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                          Team: {application.teamName}
                        </h4>
                        <div style={{ display: 'grid', gap: '5px' }}>
                          {application.teamMembers?.map((member, index) => (
                            <div key={index} style={{ color: '#6c757d' }}>
                              • {member.name} {member.email && `(${member.email})`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {user?.userType !== 'student' && application.additionalInfo && (
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Additional Information</h4>
                        <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6' }}>
                          {application.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      <span>Applied on: {new Date(application.applicationDate).toLocaleDateString()}</span>
                      {application.reviewedAt && (
                        <span>• Reviewed on: {new Date(application.reviewedAt).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Show rejection reason if rejected - Only for Faculty/Coordinators */}
                    {user?.userType !== 'student' && application.status === 'rejected' && application.rejectionReason && (
                      <div style={{ 
                        background: '#f8d7da', 
                        color: '#721c24', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginTop: '15px',
                        border: '1px solid #f5c6cb'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>
                          Rejection Reason:
                        </h4>
                        <p style={{ margin: 0, color: '#721c24', lineHeight: '1.6' }}>
                          {application.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Show remarks if any - Only for Faculty/Coordinators */}
                    {user?.userType !== 'student' && application.remarks && (
                      <div style={{ 
                        background: '#fff3cd', 
                        color: '#856404', 
                        padding: '10px', 
                        borderRadius: '8px',
                        marginTop: '15px',
                        border: '1px solid #ffeaa7'
                      }}>
                        <strong>Remarks:</strong> {application.remarks}
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '10px'
                  }}>
                    <span style={{
                      background: getStatusColor(application.status),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {application.status}
                    </span>

                    {/* Action Buttons - Only for Faculty/Coordinators */}
                    {user?.userType !== 'student' && application.status === 'pending' && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginTop: '15px',
                        justifyContent: 'flex-end'
                      }}>
                        {canApprove && (
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'approved')}
                            disabled={updating}
                            style={{
                              background: '#27ae60',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaCheck /> Approve
                          </button>
                        )}
                        {canReject && (
                          <button
                            onClick={() => openRejectModal(application)}
                            disabled={updating}
                            style={{
                              background: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaTimes /> Reject
                          </button>
                        )}
                      </div>
                    )}

                    {/* Show approve button for rejected applications (coordinators only) */}
                    {user?.userType !== 'student' && application.status === 'rejected' && canApprove && (
                      <div style={{ marginTop: '15px' }}>
                        <button
                          onClick={() => openApproveModal(application)}
                          disabled={updating}
                          style={{
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaUndo /> Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {user?.userType !== 'student' && showRejectModal ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>
              Reject Application
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              Are you sure you want to reject this application? This action requires admin password.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '600' }}>
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '600' }}>
                Admin Password *
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplication(null);
                  setRejectionReason('');
                  setAdminPassword('');
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={updating || !rejectionReason.trim() || !adminPassword}
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: updating || !rejectionReason.trim() || !adminPassword ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: updating || !rejectionReason.trim() || !adminPassword ? 0.6 : 1
                }}
              >
                {updating ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
        ) : null}

        {user?.userType !== 'student' && showApproveModal ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>
              Approve Rejected Application
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              Are you sure you want to approve this previously rejected application? This action requires admin password.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '600' }}>
                Remarks (Optional)
              </label>
              <textarea
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                placeholder="Add any remarks for approval..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '600' }}>
                Admin Password *
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedApplication(null);
                  setAdminPassword('');
                  setApprovalRemarks('');
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveRejected}
                disabled={updating || !adminPassword}
                style={{
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: updating || !adminPassword ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: updating || !adminPassword ? 0.6 : 1
                }}
              >
                {updating ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventParticipants;
