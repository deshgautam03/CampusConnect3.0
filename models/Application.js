const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamName: {
    type: String,
    required: function() { return this.isTeamApplication; }
  },
  teamMembers: [{
    type: String,
    required: function() { return this.isTeamApplication; }
  }],
  isTeamApplication: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'waived'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
});

// Ensure one application per student per event
applicationSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
