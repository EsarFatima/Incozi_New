// backend/infrastructure/models/Subscription.js
// Subscription Plan Model - Adapter Layer
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true,
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly',
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active',
  },
  features: {
    consultationsPerMonth: {
      type: Number,
      default: 0,
    },
    maxDocuments: {
      type: Number,
      default: 0,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
    advancedAnalytics: {
      type: Boolean,
      default: false,
    },
    customBranding: {
      type: Boolean,
      default: false,
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  renewalDate: {
    type: Date,
    required: true,
  },
  autoRenew: {
    type: Boolean,
    default: true,
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null,
  },
  cancellation: {
    reason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
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

module.exports = mongoose.model('Subscription', SubscriptionSchema);
