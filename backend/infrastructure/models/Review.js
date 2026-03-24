// backend/infrastructure/models/Review.js
// Review and Rating Model - Adapter Layer
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    default: null,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  categories: {
    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    expertise: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  helpful: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true,
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

// Index for faster queries
ReviewSchema.index({ consultant: 1, createdAt: -1 });
ReviewSchema.index({ service: 1, rating: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
