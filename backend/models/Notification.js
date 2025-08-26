const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  type: {
    type: String,
    enum: ['event_created', 'event_updated', 'event_cancelled', 'reminder', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipients: [{
    email: String,
    name: String,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    error: String
  }],
  totalRecipients: {
    type: Number,
    required: true
  },
  sentCount: {
    type: Number,
    default: 0
  },
  failedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'sending', 'completed', 'failed'],
    default: 'pending'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sentAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
