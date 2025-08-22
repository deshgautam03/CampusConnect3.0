const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name', 'Name is required').not().isEmpty(),
  body('phone', 'Phone number is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, department, year, studentId, designation } = req.body;
    const updateFields = { name, phone };

    // Add user type specific fields
    if (req.user.userType === 'student') {
      if (department) updateFields.department = department;
      if (year) updateFields.year = year;
      if (studentId) updateFields.studentId = studentId;
    } else if (req.user.userType === 'coordinator') {
      if (department) updateFields.department = department;
    } else if (req.user.userType === 'faculty') {
      if (department) updateFields.department = department;
      if (designation) updateFields.designation = designation;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students
router.get('/students', auth, authorize('faculty'), async (req, res) => {
  try {
    const students = await User.find({ userType: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all coordinators
router.get('/coordinators', auth, authorize('faculty'), async (req, res) => {
  try {
    const coordinators = await User.find({ userType: 'coordinator' }).select('-password');
    res.json(coordinators);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error('Error fetching coordinators:', error);
  }
});

// Update user status
router.put('/:id/status', auth, authorize('faculty'), async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create faculty account (requires admin password)
router.post('/faculty', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('adminPassword', 'Admin password is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, adminPassword } = req.body;

    // Verify admin password
    if (adminPassword !== 'Admin@123') {
      return res.status(403).json({ message: 'Invalid admin password' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new faculty user
    user = new User({
      name,
      email,
      password,
      userType: 'faculty',
      isActive: true
    });

    await user.save();

    res.status(201).json({ message: 'Faculty account created successfully' });
  } catch (error) {
    console.error('Error creating faculty account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
