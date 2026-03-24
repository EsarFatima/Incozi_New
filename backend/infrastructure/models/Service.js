// backend/infrastructure/models/Service.js
// Service Model - Adapter Layer
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['incorporation', 'bookkeeping', 'tax-compliance'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    default: null,
  },
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    priceUnit: {
      type: String,
      enum: ['one-time', 'hourly', 'monthly'],
      default: 'one-time',
    },
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  image: {
    type: String,
    default: null,
  },
  images: {
    type: [String],
    default: [],
  },
  availability: {
    daysOfWeek: {
      type: [Number], // 0-6 (Sunday-Saturday)
      default: [1, 2, 3, 4, 5], // Mon-Fri
    },
    startTime: {
      type: String,
      default: '09:00',
    },
    endTime: {
      type: String,
      default: '17:00',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
  },
  ratings: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
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

module.exports = mongoose.model('Service', ServiceSchema);
