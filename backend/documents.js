const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('./middleware');
const { Document, User } = require('./infrastructure/models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'assets/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + cleanName);
  }
});
const upload = multer({ storage: storage });

// ============================================================================
// GET /api/documents/my-documents - Fetch user specific documents
// ============================================================================
router.get('/my-documents', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await Document.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error('Fetch docs error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// POST /api/documents/upload - Upload a new document
// ============================================================================
router.post('/upload', authenticateToken, upload.array('documents'), async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const records = files.map(file => ({
      user: userId,
      fileName: file.originalname,
      fileType: file.mimetype || 'application/octet-stream',
      fileSize: file.size,
      fileUrl: file.path.replace(/\\/g, '/'), // Store relative path normalized
      category: 'other',
      visibility: 'private',
      metadata: {
        uploadedBy: userId,
        tags: [],
        isArchived: false
      }
    }));

    const uploaded = await Document.insertMany(records);

    res.json({ 
      message: 'Files uploaded successfully', 
      count: files.length,
      documents: uploaded
    });
  } catch (err) {
    console.error('Upload docs error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
