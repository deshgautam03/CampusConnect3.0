const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { broadcast } = require('../utils/realtime');
const { sendApplicationStatusEmail } = require('../utils/emailService');
const Application = require('../models/Application');
const Event = require('../models/Event');

// Get all applications for an event (Faculty/Coordinator only)
router.get('/event/:eventId', auth, authorize('faculty', 'coordinator'), async (req, res) => {
  try {
    const applications = await Application.find({ event: req.params.eventId })
      .populate('student', 'name email phone department year studentId')
      .populate('event', 'title coordinator')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching event applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event participants for students (limited information)
router.get('/event/:eventId/participants', auth, authorize('student', 'faculty', 'coordinator'), async (req, res) => {
  try {
    const applications = await Application.find({ 
      event: req.params.eventId,
      status: 'approved' // Only show approved participants
    })
      .populate('student', 'name department year studentId') // Limited student info
      .populate('event', 'title')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching event participants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's applications
router.get('/student/my-applications', auth, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('event', 'title startDate venue category')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit application
router.post('/', auth, authorize('student'), [
  body('event', 'Event ID is required').not().isEmpty(),
  body('isTeamApplication', 'Team application flag is required').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { event, isTeamApplication, teamName, teamMembers, additionalInfo } = req.body;

    // Check if event exists and is open for registration
    const eventDoc = await Event.findById(event);
    if (!eventDoc) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (new Date() > new Date(eventDoc.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if student already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      event: event
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this event' });
    }

    // Validate team application
    if (isTeamApplication) {
      if (!teamName || !teamMembers || teamMembers.length === 0) {
        return res.status(400).json({ message: 'Team name and members are required for team applications' });
      }

      if (teamMembers.length > eventDoc.teamSize) {
        return res.status(400).json({ message: `Team size cannot exceed ${eventDoc.teamSize} members` });
      }
    }

    // Create application
    const application = new Application({
      student: req.user.id,
      event: event,
      isTeamApplication,
      teamName: isTeamApplication ? teamName : undefined,
      teamMembers: isTeamApplication ? teamMembers : undefined,
      additionalInfo,
      status: 'pending',
      applicationDate: new Date()
    });

    await application.save();

    // Update event participant count
    await Event.findByIdAndUpdate(event, {
      $inc: { currentParticipants: 1 }
    });

    res.status(201).json(application);

    // Notify coordinator and faculty
    broadcast(
      { type: 'application_created', applicationId: application._id, eventId: eventDoc._id },
      (user) => user.userType === 'faculty' || (user.userType === 'coordinator' && String(user._id) === String(eventDoc.coordinator))
    );

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (Coordinator can approve/reject, Faculty can only reject)
router.put('/:id/status', auth, authorize('faculty', 'coordinator'), [
  body('status', 'Status is required').isIn(['pending', 'approved', 'rejected', 'withdrawn']),
  body('remarks', 'Remarks are optional').optional().isString(),
  body('rejectionReason', 'Rejection reason is required for rejections').optional().isString(),
  body('adminPassword', 'Admin password is required for rejections').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, remarks, rejectionReason, adminPassword } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Faculty can only reject applications, coordinators can approve/reject
    if (req.user.userType === 'faculty' && status === 'approved') {
      return res.status(403).json({ 
        message: 'Faculty can only reject applications. Please contact a coordinator for approval.' 
      });
    }

    // For rejections, require admin password
    if (status === 'rejected') {
      if (!adminPassword) {
        return res.status(400).json({ 
          message: 'Admin password is required to reject an application' 
        });
      }
      
      if (adminPassword !== 'Admin@123') {
        return res.status(403).json({ 
          message: 'Invalid admin password' 
        });
      }

      if (!rejectionReason || rejectionReason.trim() === '') {
        return res.status(400).json({ 
          message: 'Rejection reason is required' 
        });
      }
    }

    // Update application
    application.status = status;
    application.remarks = remarks;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;

    if (status === 'rejected') {
      application.rejectionReason = rejectionReason;
      application.rejectionDate = new Date();
      application.approvalDate = undefined;
    } else if (status === 'approved') {
      application.approvalDate = new Date();
      application.rejectionDate = undefined;
      application.rejectionReason = '';
    }

    await application.save();

    // Send email notification to student
    try {
      console.log('Attempting to send status update email for application:', application._id);
      // Populate the application with student and event details for email
      const populatedApplication = await Application.findById(application._id)
        .populate('student', 'name email')
        .populate('event', 'title');
      
      console.log('Populated application:', {
        studentEmail: populatedApplication.student?.email,
        eventTitle: populatedApplication.event?.title
      });
      
      await sendApplicationStatusEmail(populatedApplication, status);
      console.log('Status update email sent successfully');
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
      // Don't fail the request if email fails
    }

    res.json(application);

    // Notify relevant users
    broadcast(
      { type: 'application_status', applicationId: application._id, status: application.status },
      (user) => user.userType === 'faculty' || (user.userType === 'coordinator' && String(user._id) === String(application.event.coordinator))
    );

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve rejected application (Coordinator only)
router.put('/:id/approve-rejected', auth, authorize('coordinator'), [
  body('adminPassword', 'Admin password is required').not().isEmpty(),
  body('remarks', 'Remarks are optional').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminPassword, remarks } = req.body;

    if (adminPassword !== 'Admin@123') {
      return res.status(403).json({ 
        message: 'Invalid admin password' 
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'rejected') {
      return res.status(400).json({ 
        message: 'Only rejected applications can be approved' 
      });
    }

    // Update application
    application.status = 'approved';
    application.remarks = remarks || application.remarks;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;
    application.approvalDate = new Date();
    application.rejectionDate = undefined;
    application.rejectionReason = '';

    await application.save();

    // Send email notification to student
    try {
      console.log('Attempting to send approval email for application:', application._id);
      // Populate the application with student and event details for email
      const populatedApplication = await Application.findById(application._id)
        .populate('student', 'name email')
        .populate('event', 'title');
      
      console.log('Populated application for approval:', {
        studentEmail: populatedApplication.student?.email,
        eventTitle: populatedApplication.event?.title
      });
      
      await sendApplicationStatusEmail(populatedApplication, 'approved');
      console.log('Approval email sent successfully');
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the request if email fails
    }

    res.json(application);

    // Notify relevant users
    broadcast(
      { type: 'application_status', applicationId: application._id, status: application.status },
      (user) => user.userType === 'faculty' || (user.userType === 'coordinator' && String(user._id) === String(application.event.coordinator))
    );

  } catch (error) {
    console.error('Error approving rejected application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application statistics (Faculty only)
router.get('/stats', auth, authorize('faculty'), async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pendingApplications: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedApplications: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejectedApplications: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    const eventCount = await Event.countDocuments();
    const participantCount = await Application.countDocuments({ status: 'approved' });

    res.json({
      totalApplications: stats[0]?.totalApplications || 0,
      pendingApplications: stats[0]?.pendingApplications || 0,
      approvedApplications: stats[0]?.approvedApplications || 0,
      rejectedApplications: stats[0]?.rejectedApplications || 0,
      totalEvents: eventCount,
      totalParticipants: participantCount,
      totalNotifications: 0 // Placeholder for now
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
