const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { sendEventNotification, sendFacultyEventNotification } = require('../utils/emailService');
const { broadcast } = require('../utils/realtime');
const Event = require('../models/Event');
const { upload, deleteImage } = require('../config/cloudinary');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event
router.post('/', [
  auth,
  authorize('coordinator'),
  upload.single('image'),
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('shortDescription', 'Short description is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
  body('startDate', 'Start date is required').not().isEmpty(),
  body('endDate', 'End date is required').not().isEmpty(),
  body('registrationDeadline', 'Registration deadline is required').not().isEmpty(),
  body('venue', 'Venue is required').not().isEmpty(),
  body('maxParticipants', 'Max participants is required').isInt({ min: 1 }),
  body('isTeamEvent', 'Team event flag is required').isBoolean(),
  body('teamSize', 'Team size is required for team events').if(body('isTeamEvent').equals(true)).isInt({ min: 2 }),
  body('entryFee', 'Entry fee must be a number').isFloat({ min: 0 }),
  body('prizes', 'Prizes are required').not().isEmpty(),
  body('requirements', 'Requirements are required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      coordinator: req.user.id,
      isActive: true,
      currentParticipants: 0
    };

    if (req.file) {
      // Cloudinary returns the secure_url in req.file.path
      eventData.image = req.file.path;
    }

    const event = new Event(eventData);
    await event.save();

    // Populate coordinator information for email notifications
    const populatedEvent = await Event.findById(event._id).populate('coordinator', 'name email department');

    // Send email notifications
    await sendEventNotification(populatedEvent).catch(() => {});
    await sendFacultyEventNotification(populatedEvent).catch(() => {});

    broadcast({ type: 'event_created', eventId: event._id });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', [
  auth,
  authorize('coordinator'),
  upload.single('image'),
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('shortDescription', 'Short description is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
  body('startDate', 'Start date is required').not().isEmpty(),
  body('endDate', 'End date is required').not().isEmpty(),
  body('registrationDeadline', 'Registration deadline is required').not().isEmpty(),
  body('venue', 'Venue is required').not().isEmpty(),
  body('maxParticipants', 'Max participants is required').isInt({ min: 1 }),
  body('isTeamEvent', 'Team event flag is required').isBoolean(),
  body('teamSize', 'Team size is required for team events').if(body('isTeamEvent').equals(true)).isInt({ min: 2 }),
  body('entryFee', 'Entry fee must be a number').isFloat({ min: 0 }),
  body('prizes', 'Prizes are required').not().isEmpty(),
  body('requirements', 'Requirements are required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the coordinator of this event
    if (event.coordinator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update event data
    Object.assign(event, req.body);

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (event.image && event.image.includes('cloudinary.com')) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = event.image.split('/').pop().split('.')[0];
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      // Set new image URL
      event.image = req.file.path;
    }

    await event.save();

    broadcast({ type: 'event_updated', eventId: event._id });

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, authorize('coordinator'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the coordinator of this event
    if (event.coordinator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete image from Cloudinary if it exists
    if (event.image && event.image.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = event.image.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    broadcast({ type: 'event_deleted', eventId: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get coordinator's events
router.get('/coordinator/my-events', auth, authorize('coordinator'), async (req, res) => {
  try {
    const events = await Event.find({ coordinator: req.user.id }).sort({ registrationDeadline: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching coordinator events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
