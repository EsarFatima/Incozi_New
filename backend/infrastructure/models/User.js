// backend/infrastructure/models/User.js
// User Model - Adapter Layer
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['client', 'consultant', 'admin'],
    default: 'client',
  },
  profile: {
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    credentials: {
      type: String,
      default: null,
    },
    expertise: {
      type: [String],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: null,
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationExpiry: {
      type: Date,
      default: null,
    },
    badge: {
      type: String,
      enum: ['none', 'verified', 'certified', 'expert'],
      default: 'none',
    },
  },
  payment: {
    stripeCustomerId: {
      type: String,
      default: null,
    },
    savedPaymentMethods: {
      type: [String],
      default: [],
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'standard', 'premium'],
      default: 'free',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
  },
  activityLog: {
    lastLogin: {
      type: Date,
      default: null,
    },
    lastActive: {
      type: Date,
      default: new Date(),
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
