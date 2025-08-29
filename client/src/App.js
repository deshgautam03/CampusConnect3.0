import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import FacultyLogin from './components/auth/FacultyLogin';
import FacultyRegister from './components/auth/FacultyRegister';
import Profile from './components/pages/Profile';
import Dashboard from './components/dashboard/Dashboard';
import EventDetails from './components/pages/EventDetails';
import ApplyForEvent from './components/pages/ApplyForEvent';
import MyApplications from './components/pages/MyApplications';
import MyEvents from './components/pages/MyEvents';
import CreateEvent from './components/pages/CreateEvent';
import EditEvent from './components/pages/EditEvent';
import FacultyUserManagement from './components/pages/FacultyUserManagement';
import Events from './components/pages/Events';
import EventParticipants from './components/pages/EventParticipants';

// CSS
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/faculty-login" element={<FacultyLogin />} />
            <Route path="/faculty-register" element={<FacultyRegister />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetails />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student', 'coordinator', 'faculty']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/apply/:id" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ApplyForEvent />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/my-events" 
              element={
                <ProtectedRoute allowedRoles={['coordinator']}>
                  <MyEvents />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute allowedRoles={['coordinator']}>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/edit-event/:id" 
              element={
                <ProtectedRoute allowedRoles={['coordinator']}>
                  <EditEvent />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/faculty/users" 
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyUserManagement />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/event-participants/:id" 
              element={
                <ProtectedRoute allowedRoles={['student', 'faculty', 'coordinator']}>
                  <EventParticipants />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'coordinator', 'faculty']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
}

export default App;
