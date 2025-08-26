const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get all notifications (Faculty only)
// @access  Private (Faculty only)
router.get('/', [auth, authorize('faculty')], async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('event', 'title')
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get notification by ID (Faculty only)
// @access  Private (Faculty only)
router.get('/:id', [auth, authorize('faculty')], async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('event', 'title description startDate endDate venue')
      .populate('sentBy', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/event/:eventId
// @desc    Get notifications for a specific event (Faculty/Coordinator)
// @access  Private (Faculty/Coordinator)
router.get('/event/:eventId', [auth, authorize('faculty', 'coordinator')], async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if coordinator is authorized to view notifications for this event
    if (req.user.userType === 'coordinator') {
      const Event = require('../models/Event');
      const event = await Event.findById(eventId);
      if (!event || event.coordinator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view notifications for this event' });
      }
    }

    const notifications = await Notification.find({ event: eventId })
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (Faculty only)
// @access  Private (Faculty only)
router.get('/stats', [auth, authorize('faculty')], async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRecipients: { $sum: '$totalRecipients' },
          totalSent: { $sum: '$sentCount' },
          totalFailed: { $sum: '$failedCount' }
        }
      }
    ]);

    const totalNotifications = await Notification.countDocuments();
    const totalEvents = await Notification.distinct('event').length;

    res.json({
      statusBreakdown: stats,
      totalNotifications,
      totalEvents
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
