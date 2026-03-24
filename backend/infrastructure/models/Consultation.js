// backend/infrastructure/models/Consultation.js
// Consultation Booking Model - Adapter Layer
const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  meetingType: {
    type: String,
    enum: ['video', 'phone', 'in-person', 'chat'],
    default: 'video',
  },
  meetingDetails: {
    videoLink: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
  },
  payment: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  notes: {
    clientNotes: {
      type: String,
      default: null,
    },
    consultantNotes: {
      type: String,
      default: null,
    },
  },
  documents: {
    type: [String], // URLs to documents
    default: [],
  },
  reminder: {
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentDate: {
      type: Date,
      default: null,
    },
  },
  cancellation: {
    reason: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: String,
      enum: ['client', 'consultant', 'system'],
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

module.exports = mongoose.model('Consultation', ConsultationSchema);
