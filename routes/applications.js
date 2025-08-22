const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { broadcast } = require('../utils/realtime');
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

// Update application status (Faculty/Coordinator only)
router.put('/:id/status', auth, authorize('faculty', 'coordinator'), [
  body('status', 'Status is required').isIn(['pending', 'approved', 'rejected', 'withdrawn']),
  body('remarks', 'Remarks are optional').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application
    application.status = status;
    application.remarks = remarks;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;

    await application.save();

    res.json(application);

    broadcast(
      { type: 'application_status', applicationId: application._id, status: application.status },
      (user) => user.userType === 'faculty' || (user.userType === 'coordinator' && String(user._id) === String(eventDoc.coordinator))
    );

  } catch (error) {
    console.error('Error updating application status:', error);
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
