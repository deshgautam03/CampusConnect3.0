import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    studentId: '',
    year: '',
    designation: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        studentId: user.studentId || '',
        year: user.year || '',
        designation: user.designation || ''
      });
    }
  }, [user]);

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
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      studentId: user.studentId || '',
      year: user.year || '',
      designation: user.designation || ''
    });
    setIsEditing(false);
  };

  const getUserTypeDisplay = () => {
    switch (user?.userType) {
      case 'student':
        return 'Student';
      case 'coordinator':
        return 'Event Coordinator';
      case 'faculty':
        return 'Faculty Member';
      default:
        return 'User';
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={60} />
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="user-type">{getUserTypeDisplay()}</p>
          <p className="user-email">{user.email}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <p>{user.email}</p>
              <small>Email cannot be changed</small>
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              ) : (
                <p>{user.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Department</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              ) : (
                <p>{user.department || 'Not specified'}</p>
              )}
            </div>

                         {user.userType === 'student' && (
               <>
                 <div className="profile-field">
                   <label>Student ID</label>
                   {isEditing ? (
                     <input
                       type="text"
                       name="studentId"
                       value={formData.studentId}
                       onChange={handleChange}
                       className="form-control"
                       required
                     />
                   ) : (
                     <p>{user.studentId || 'Not provided'}</p>
                   )}
                 </div>

                 <div className="profile-field">
                   <label>Year of Study</label>
                   {isEditing ? (
                     <select
                       name="year"
                       value={formData.year}
                       onChange={handleChange}
                       className="form-control"
                       required
                     >
                       <option value="">Select Year</option>
                       <option value="1">1st Year</option>
                       <option value="2">2nd Year</option>
                       <option value="3">3rd Year</option>
                       <option value="4">4th Year</option>
                     </select>
                   ) : (
                     <p>{user.year ? `${user.year}${getOrdinalSuffix(user.year)} Year` : 'Not specified'}</p>
                   )}
                 </div>
               </>
             )}

             {user.userType === 'faculty' && (
               <div className="profile-field">
                 <label>Designation</label>
                 {isEditing ? (
                   <select
                     name="designation"
                     value={formData.designation}
                     onChange={handleChange}
                     className="form-control"
                     required
                   >
                     <option value="">Select Designation</option>
                     <option value="Professor">Professor</option>
                     <option value="Associate Professor">Associate Professor</option>
                     <option value="Assistant Professor">Assistant Professor</option>
                     <option value="Lecturer">Lecturer</option>
                     <option value="Head of Department">Head of Department</option>
                     <option value="Dean">Dean</option>
                     <option value="Other">Other</option>
                   </select>
                 ) : (
                   <p>{user.designation || 'Not specified'}</p>
                 )}
               </div>
             )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Account Type</label>
              <p>{getUserTypeDisplay()}</p>
            </div>

            <div className="profile-field">
              <label>Account Status</label>
              <p className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div className="profile-field">
              <label>Member Since</label>
              <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for ordinal suffixes
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

export default Profile;
