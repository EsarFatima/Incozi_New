const express = require('express');
const router = express.Router();
const { Message, User, Consultation } = require('./infrastructure/models');
const { sendAdminChatMessageNotification } = require('./emailService');
const { authenticateToken } = require('./middleware');

// ============================================================================
// POST /api/chat/session - Get or create chat session
// ============================================================================
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for existing active session (consultations serve as sessions)
    let consultation = await Consultation.findOne({
      userId,
      status: { $in: ['active', 'pending'] }
    });

    if (!consultation) {
      // Create new consultation as session with unique bookingId
      const bookingId = 'CHAT_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      consultation = await Consultation.create({
        bookingId,
        userId,
        status: 'active',
        scheduledAt: null
      });
    }

    res.json({
      session: {
        id: consultation._id,
        userId: consultation.userId,
        status: consultation.status
      }
    });
  } catch (err) {
    console.error('Error in /session:', err);
    res.status(500).json({ error: 'Failed to initialize chat session', details: err.message });
  }
});

// ============================================================================
// GET /api/chat/session/:sessionId/messages - Get messages for a session
// ============================================================================
router.get('/session/:sessionId/messages', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify ownership or admin
    const consultation = await Consultation.findById(sessionId);

    if (!consultation) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (consultation.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Fetch messages for this consultation
    const messages = await Message.find({ consultationId: sessionId })
      .populate('senderId', 'firstName lastName role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ============================================================================
// POST /api/chat/message - Send a message
// ============================================================================
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const senderId = req.user.id;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Verify access to session
    const consultation = await Consultation.findById(sessionId);

    if (!consultation) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (consultation.userId.toString() !== senderId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create message
    const newMessage = await Message.create({
      consultationId: sessionId,
      sender: senderId,
      senderId: senderId,
      content: message,
      createdAt: new Date()
    });

    // Update consultation timestamp
    consultation.updatedAt = new Date();
    await consultation.save();

    // Notify admin via email if sender is not admin
    if (req.user.role !== 'admin') {
      try {
        const user = await User.findById(req.user.id);
        const senderName = user?.firstName || 'Client';

        sendAdminChatMessageNotification(senderName, user?.email || '', message)
          .catch(err => console.error('Error sending chat notification email:', err));
      } catch (err) {
        console.error('Error getting user for email:', err);
      }
    }

    res.json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

// ============================================================================
// GET /api/chat/admin/sessions - Get all open sessions (Admin)
// ============================================================================
router.get('/admin/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const sessions = await Consultation.find({ status: { $in: ['active', 'pending'] } })
      .populate('userId', 'firstName lastName email')
      .sort({ updatedAt: -1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error admin sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// ============================================================================
// DELETE /api/chat/message/:messageId - Delete a message (Unsend)
// ============================================================================
router.delete('/message/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists
    const msg = await Message.findById(messageId);

    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender or admin can delete
    if (msg.senderId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Time limit: 1 minute (non-admin only)
    const createdTime = new Date(msg.createdAt).getTime();
    const now = Date.now();
    if (req.user.role !== 'admin' && (now - createdTime > 60000)) {
      return res.status(403).json({ error: 'Message cannot be deleted after 1 minute' });
    }

    // Delete message
    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
