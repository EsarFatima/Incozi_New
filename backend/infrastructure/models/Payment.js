// backend/infrastructure/models/Payment.js
// Payment Transaction Model - Adapter Layer
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    default: null,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paymentType: {
    type: String,
    enum: ['consultation', 'subscription', 'service'],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'stripe'],
    default: 'stripe',
  },
  stripePaymentIntentId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
    default: 'pending',
  },
  description: {
    type: String,
    default: null,
  },
  invoice: {
    invoiceNumber: {
      type: String,
      default: null,
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
  },
  refund: {
    refundAmount: {
      type: Number,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  metadata: {
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
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

// Index for faster queries
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
