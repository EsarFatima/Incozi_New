const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('./middleware');
const { Service, Subscription, Payment, Document, User, Consultation } = require('./infrastructure/models');
const emailService = require('./emailService');

// ============================================================================
// GET /api/services - Returns all services with their plans
// ============================================================================
router.get('/', async (req, res) => {
  try {
    // Fetch active services
    const services = await Service.find({ status: 'active' });

    // Format response with empty plans array for now
    // (Populate plans from Subscription model if needed)
    const result = services.map(service => ({
      ...service.toObject(),
      plans: [] // Plans can be populated from Subscription/Product data as needed
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET /api/services/my-subscriptions?userId=1 - Get user's subscriptions
// ============================================================================
router.get('/my-subscriptions', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const subscriptions = await Subscription.find({
      userId,
      status: { $ne: 'cancelled' }
    })
      .populate('serviceId')
      .sort({ createdAt: -1 });

    const shaped = (subscriptions || []).map((s) => ({
      id: s._id,
      service_name: s.serviceId?.name || s.itemName,
      status: s.status,
      order_status: s.orderStatus || 'pending',
      tracking_notes: s.trackingNotes || '',
      end_date: s.endDate,
      start_date: s.startDate,
      price: s.amount || 0,
      billing_cycle: s.billingCycle || 'monthly'
    }));

    res.json(shaped);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// PUT /api/services/subscriptions/:subId/status - Update order status (Admin)
// ============================================================================
router.put('/subscriptions/:subId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { subId } = req.params;
    const { order_status, tracking_notes } = req.body;

    const updateData = { orderStatus: order_status };
    if (tracking_notes !== undefined) {
      updateData.trackingNotes = tracking_notes;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      subId,
      updateData,
      { new: true }
    ).populate('userId');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Get user for email notification
    const user = await User.findById(subscription.userId);
    if (user) {
      try {
        await emailService.sendOrderStatusUpdate(
          user.email,
          (user.firstName || '') + ' ' + (user.lastName || ''),
          order_status,
          tracking_notes
        );
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET /api/services/admin/orders - Get all orders (Admin)
// ============================================================================
router.get('/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let query = Subscription.find()
      .populate('userId')
      .populate('serviceId')
      .sort({ createdAt: -1 });

    if (status) {
      query = query.where('orderStatus').equals(status);
    }

    const orders = await query;

    // Format response to match Supabase structure
    const formatted = orders.map(order => ({
      id: order._id,
      status: order.status,
      order_status: order.orderStatus,
      tracking_notes: order.trackingNotes,
      created_at: order.createdAt,
      start_date: order.startDate,
      user: {
        id: order.userId?._id,
        full_name: (order.userId?.firstName || '') + ' ' + (order.userId?.lastName || ''),
        email: order.userId?.email
      },
      service: {
        name: order.serviceId?.name || order.itemName
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET /api/services/admin/stats - Get order and revenue stats (Admin)
// ============================================================================
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 1. Get all subscriptions for status counts
    const allSubscriptions = await Subscription.find();

    // 2. Get successful payments for revenue calculation
    const successfulPayments = await Payment.find({ paymentStatus: 'success' });
    const totalRevenue = successfulPayments.reduce(
      (sum, p) => sum + (parseFloat(p.amount) || 0),
      0
    );

    // 3. Get consultation count
    let consultationCount = 0;
    try {
      consultationCount = await Consultation.countDocuments();
    } catch (err) {
      console.warn('Could not count consultations:', err.message);
      consultationCount = 0;
    }

    // Calculate stats
    const stats = {
      total: allSubscriptions.length,
      pending: allSubscriptions.filter(s => s.orderStatus === 'pending').length,
      in_progress: allSubscriptions.filter(s => s.orderStatus === 'in_progress').length,
      completed: allSubscriptions.filter(s => s.orderStatus === 'completed').length,
      active: allSubscriptions.filter(s => s.status === 'active').length,
      revenue: totalRevenue,
      consultations: consultationCount
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET /api/services/admin/documents - Get all documents (Admin)
// ============================================================================
router.get('/admin/documents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('userId')
      .sort({ uploadedAt: -1 });

    // Format to include user details
    const formatted = documents.map(doc => ({
      ...doc.toObject(),
      user: {
        full_name: (doc.userId?.firstName || '') + ' ' + (doc.userId?.lastName || ''),
        email: doc.userId?.email
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching admin documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
