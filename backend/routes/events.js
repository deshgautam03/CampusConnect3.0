const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const { sendEventNotification } = require('../utils/emailService');
const { broadcast } = require('../utils/realtime');
const Event = require('../models/Event');

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});
const upload = multer({ storage });

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
      eventData.image = `/uploads/${req.file.filename}`;
    }

    const event = new Event(eventData);
    await event.save();

    // Send email notification
    await sendEventNotification(event).catch(() => {});

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

    // Update event
    Object.assign(event, req.body);
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
