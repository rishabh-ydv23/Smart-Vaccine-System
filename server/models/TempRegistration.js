const mongoose = require('mongoose');

const tempRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    sparse: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  governmentId: {
    type: String,
    required: true,
    trim: true,
    sparse: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  otp: {
    type: String,
    required: true
  },
  otpExpires: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Expire document after 1 hour (3600 seconds)
  }
});

// Before saving, remove any existing pending registration for this email
// This ensures only one pending registration per email
tempRegistrationSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Delete any other pending registrations with same email
      await mongoose.model('TempRegistration').deleteMany({
        email: this.email,
        _id: { $ne: this._id }
      });
    } catch (err) {
      console.error('Error cleaning up duplicate temp registrations:', err);
    }
  }
  next();
});

// Index for efficient querying and auto-expiration
tempRegistrationSchema.index({ email: 1 });
tempRegistrationSchema.index({ otp: 1 });
tempRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('TempRegistration', tempRegistrationSchema);