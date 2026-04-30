const express = require('express');
const router = express.Router();
const emailService = require('./emailService');
const { Consultation, User } = require('./infrastructure/models');
const { authenticateToken } = require('./middleware');

// ============================================================================
// GET /api/consultations - List user's consultations
// ============================================================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const consultations = await Consultation.find({
      userId: req.user.id
    }).sort({ scheduledAt: 1 });

    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/consultations/booked-slots - Return booked times for a specific date (PUBLIC)
// ============================================================================
router.get('/booked-slots', async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ error: 'Date required' });

    // Create date range
    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(`${date}T23:59:59`);

    // Find booked consultations for the date (excluding cancelled)
    const consultations = await Consultation.find({
      scheduledAt: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $ne: 'cancelled' }
    });

    // Extract times (HH:MM format)
    const times = consultations.map(c => {
      const dt = new Date(c.scheduledAt);
      return dt.toTimeString().substring(0, 5);
    });

    res.json(times);
  } catch (error) {
    console.error('Booked slots error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// ============================================================================
// POST /api/consultations/book - Schedule a new consultation
// ============================================================================
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { date, time, topic, notes } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and Time are required' });
    }

    // Combine date and time into ISO string
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    // Check availability
    const existing = await Consultation.findOne({
      scheduledAt: new Date(scheduledAt),
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return res.status(400).json({ error: 'This time slot is already booked. Please choose another.' });
    }

    // Create consultation
    const consultation = await Consultation.create({
      userId: req.user.id,
      scheduledAt: new Date(scheduledAt),
      notes: topic + (notes ? ` - ${notes}` : ''),
      status: 'scheduled'
    });

    // Get user for email
    const user = await User.findById(req.user.id);

    if (user && user.email) {
      // Send confirmation email to user
      try {
        await emailService.sendConsultationBookingConfirmation(user.email, {
          date,
          time,
          topic,
          meetingLink: 'https://meet.google.com/abc-defg-hij'
        });
      } catch (emailError) {
        console.error('Error sending user email:', emailError);
      }

      // Send notification email to admin
      try {
        await emailService.sendConsultationNotificationToAdmin(user, {
          date,
          time,
          topic,
          notes
        });
      } catch (emailError) {
        console.error('Error sending admin email:', emailError);
      }
    }

    res.json({ 
      message: 'Consultation booked successfully', 
      consultation 
    });
  } catch (error) {
    console.error('Booking Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to book consultation', details: error.message });
  }
});

module.exports = router;
