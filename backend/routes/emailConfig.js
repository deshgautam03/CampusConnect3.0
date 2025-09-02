const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const EmailConfiguration = require('../models/EmailConfiguration');

// Get email configuration
router.get('/:type', auth, authorize('faculty'), async (req, res) => {
  try {
    console.log('GET email config request:', {
      type: req.params.type,
      user: req.user?.id,
      userType: req.user?.userType
    });
    
    const { type } = req.params;
    
    if (!['student_emails', 'faculty_emails'].includes(type)) {
      return res.status(400).json({ message: 'Invalid email configuration type' });
    }

    const config = await EmailConfiguration.findOne({ type });
    
    if (!config) {
      return res.json({ emails: [] });
    }

    res.json({ emails: config.emails });
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update email configuration
router.put('/:type', [
  auth,
  authorize('faculty'),
  body('emails').isArray().withMessage('Emails must be an array'),
  body('emails.*').isEmail().withMessage('Each email must be valid')
], async (req, res) => {
  try {
    console.log('Email config update request:', {
      type: req.params.type,
      user: req.user?.id,
      userType: req.user?.userType,
      emails: req.body.emails
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { type } = req.params;
    const { emails } = req.body;
    
    if (!['student_emails', 'faculty_emails'].includes(type)) {
      return res.status(400).json({ message: 'Invalid email configuration type' });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'At least one email address is required' });
    }

    // Remove duplicates and trim emails
    const uniqueEmails = [...new Set(emails.map(email => email.trim().toLowerCase()))];
    
    // Validate that all emails are valid after processing
    const invalidEmails = uniqueEmails.filter(email => !email.includes('@') || email.length < 5);
    if (invalidEmails.length > 0) {
      return res.status(400).json({ 
        message: `Invalid email format: ${invalidEmails.join(', ')}` 
      });
    }

    const config = await EmailConfiguration.findOneAndUpdate(
      { type },
      { 
        emails: uniqueEmails,
        updatedBy: req.user.id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ 
      message: `${type.replace('_', ' ')} updated successfully`,
      emails: config.emails 
    });
  } catch (error) {
    console.error('Error updating email configuration:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete email configuration
router.delete('/:type', auth, authorize('faculty'), async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['student_emails', 'faculty_emails'].includes(type)) {
      return res.status(400).json({ message: 'Invalid email configuration type' });
    }

    await EmailConfiguration.findOneAndDelete({ type });

    res.json({ message: `${type.replace('_', ' ')} configuration deleted successfully` });
  } catch (error) {
    console.error('Error deleting email configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
