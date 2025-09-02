const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendEmail, sendWelcomeEmail, sendOTPEmail } = require('../utils/emailService');
const crypto = require('crypto');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('userType', 'User type is required').isIn(['student', 'coordinator', 'faculty']),
  body('phone', 'Phone number is required').not().isEmpty(),
  body('department', 'Department is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, userType, studentId, department, year, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user object
    const userFields = {
      name,
      email,
      password,
      userType,
      department,
      phone
    };

    // Add student-specific fields
    if (userType === 'student') {
      if (!studentId || !year) {
        return res.status(400).json({ message: 'Student ID and year are required for students' });
      }
      userFields.studentId = studentId;
      userFields.year = year;
    }

    // Add faculty-specific fields
    if (userType === 'faculty') {
      if (!req.body.designation) {
        return res.status(400).json({ message: 'Designation is required for faculty members' });
      }
      if (!req.body.adminPassword) {
        return res.status(400).json({ message: 'Admin password is required for faculty registration' });
      }
      if (req.body.adminPassword !== 'Admin@123') {
        return res.status(403).json({ message: 'Invalid admin password. Only authorized administrators can create faculty accounts.' });
      }
      userFields.designation = req.body.designation;
    }

    // Add coordinator-specific validation
    if (userType === 'coordinator') {
      if (!req.body.adminPassword) {
        return res.status(400).json({ message: 'Admin password is required for coordinator registration' });
      }
      if (req.body.adminPassword !== 'Admin@123') {
        return res.status(403).json({ message: 'Invalid admin password. Only authorized administrators can create coordinator accounts.' });
      }
    }

    user = new User(userFields);
    await user.save();
    // Fire and forget welcome email (non-blocking)
    sendWelcomeEmail(user).catch(() => {});

    // Create JWT token
    const payload = {
      userId: user.id,
      userType: user.userType
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            department: user.department
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset OTP
// @access  Public
router.post('/forgot-password', [
  body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Generate 6-digit OTP
    const otp = ('' + Math.floor(100000 + Math.random() * 900000));
    user.passwordResetOTP = otp;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    res.json({ message: 'OTP has been sent to your email.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error or email not found' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and reset password
// @access  Public
router.post('/reset-password', [
  body('email', 'Please include a valid email').isEmail(),
  body('otp', 'OTP is required').isLength({ min: 4 }),
  body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (user.passwordResetOTP !== otp || user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.passwordResetOTP = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Only allow students and coordinators to login through regular login
    if (user.userType === 'faculty') {
      return res.status(403).json({ 
        message: 'Faculty members must use the faculty login portal. Please go to /faculty-login' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user.id,
      userType: user.userType
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            department: user.department,
            studentId: user.studentId,
            year: user.year
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/faculty-login
// @desc    Faculty login with predefined credentials
// @access  Public
router.post('/faculty-login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if faculty exists
    const faculty = await User.findOne({ email, userType: 'faculty' });
    if (!faculty) {
      return res.status(400).json({ 
        message: 'Invalid faculty credentials or this account is not a faculty account. Only faculty members can use this login portal.' 
      });
    }

    // Check password
    const isMatch = await faculty.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const payload = {
      userId: faculty.id,
      userType: faculty.userType
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: faculty.id,
            name: faculty.name,
            email: faculty.email,
            userType: faculty.userType
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
