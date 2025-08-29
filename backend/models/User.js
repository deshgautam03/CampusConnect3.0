const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['student', 'coordinator', 'faculty'],
    required: true
  },
  studentId: {
    type: String,
    required: function() { return this.userType === 'student'; }
  },
  department: {
    type: String,
    required: function() { return this.userType === 'student' || this.userType === 'coordinator' || this.userType === 'faculty'; }
  },
  year: {
    type: Number,
    required: function() { return this.userType === 'student'; }
  },
  phone: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: function() { return this.userType === 'faculty'; }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordResetOTP: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
