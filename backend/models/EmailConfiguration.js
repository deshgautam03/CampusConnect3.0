const mongoose = require('mongoose');

const emailConfigurationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['student_emails', 'faculty_emails'],
    required: true
  },
  emails: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one configuration per type
emailConfigurationSchema.index({ type: 1 }, { unique: true });

module.exports = mongoose.model('EmailConfiguration', emailConfigurationSchema);
