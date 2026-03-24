// backend/infrastructure/models/Document.js
// Document Management Model - Adapter Layer
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
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
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    enum: ['contract', 'invoice', 'receipt', 'notes', 'report', 'other'],
    default: 'other',
  },
  visibility: {
    type: String,
    enum: ['private', 'consultant', 'shared', 'public'],
    default: 'private',
  },
  sharedWith: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  versioning: {
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: {
      type: [String],
      default: [],
    },
  },
  metadata: {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
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
DocumentSchema.index({ user: 1, createdAt: -1 });
DocumentSchema.index({ consultation: 1 });

module.exports = mongoose.model('Document', DocumentSchema);
