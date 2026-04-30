const express = require('express');
const router = express.Router();
const { requireAdmin } = require('./middleware');
const { User, Document, Subscription, Consultation } = require('./infrastructure/models');
const fs = require('fs');
const path = require('path');

// ============================================================================
// GET /api/admin/stats - Get admin statistics
// ============================================================================
router.get('/stats', async (req, res) => {
  try {
    // 1. Total users
    const userCount = await User.countDocuments();

    // 2. Total orders (subscriptions)
    const orderCount = await Subscription.countDocuments();

    // 3. Documents uploaded by clients
    const docCount = await Document.countDocuments({ uploadedBy: 'client' });

    res.json({
      users: userCount,
      orders: orderCount,
      documents: docCount
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ============================================================================
// GET /api/admin/clients - Get all clients
// ============================================================================
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: { $ne: 'admin' } })
      .select('_id firstName lastName email role createdAt verification.isVerified')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    console.error('Admin Clients Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/admin/documents - Get all documents
// ============================================================================
router.get('/documents', async (req, res) => {
  try {
    const docs = await Document.find()
      .populate('userId', 'firstName lastName email')
      .sort({ uploadedAt: -1 });

    // Generate local URLs for documents
    const signedDocs = docs.map(doc => {
      let downloadUrl = doc.filePath;
      if (doc.filePath && !doc.filePath.startsWith('http')) {
        downloadUrl = `/uploads/${path.basename(doc.filePath)}`;
      }

      return {
        ...doc.toObject(),
        download_url: downloadUrl
      };
    });

    res.json(signedDocs);
  } catch (error) {
    console.error('Admin Documents Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/admin/payment-methods - Get all payment methods
// ============================================================================
router.get('/payment-methods', async (req, res) => {
  try {
    const { cardDetail, cardType } = req.query;

    let query = {};
    if (cardType && cardType !== '(All)') {
      query.cardType = { $regex: cardType, $options: 'i' };
    }

    // Note: payment-methods collection may not exist yet
    // This is a placeholder that returns empty array
    res.json([]);
  } catch (error) {
    console.error('Admin Payment Methods Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// DELETE /api/admin/documents/:id - Delete a document
// ============================================================================
router.delete('/documents/:id', async (req, res) => {
  try {
    const docId = req.params.id;

    // Get the document first
    const doc = await Document.findById(docId);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete from database
    await Document.findByIdAndDelete(docId);

    // Clean up physical file if it exists
    if (doc.filePath) {
      if (!doc.filePath.startsWith('http')) {
        // Try to delete local file
        const filePath = path.join(__dirname, '..', doc.filePath);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fileErr) {
            console.error('Error deleting physical file:', fileErr);
            // Don't fail the request if file deletion fails
          }
        }
      }
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Document Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
