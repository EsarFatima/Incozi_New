const express = require('express');
const router = express.Router();
const { User, Payment, Subscription, Document, Consultation } = require('./infrastructure/models');

// ============================================================================
// GET /api/dashboard/accounting - Get user transactions
// ============================================================================
router.get('/accounting', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, orderId } = req.query;

    let query = Payment.find({ userId }).sort({ createdAt: -1 });

    if (type && type !== 'All') {
      if (type === 'Orders Only') {
        query = query.where('transactionType').equals('order');
      } else if (type === 'Payments Only') {
        query = query.where('transactionType').equals('payment');
      }
    }

    if (orderId) {
      query = query.where('subscriptionId').equals(orderId);
    }

    const payments = await query;
    res.json(payments || []);
  } catch (err) {
    console.error('Accounting API Error:', err);
    res.status(500).json({ error: 'Failed to fetch accounting data' });
  }
});

// ============================================================================
// GET /api/dashboard/entities - Get user companies (placeholder)
// ============================================================================
router.get('/entities', async (req, res) => {
  try {
    const userId = req.user.id;
    // Entities might not exist in MongoDB yet, return empty array
    res.json([]);
  } catch (err) {
    console.error('Entities API Error:', err);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// ============================================================================
// GET /api/dashboard/calendar - Get compliance events (placeholder)
// ============================================================================
router.get('/calendar', async (req, res) => {
  try {
    const userId = req.user.id;
    const { entity, jurisdiction, start, end } = req.query;

    // Calendar events might not exist yet, return empty array
    res.json([]);
  } catch (err) {
    console.error('Calendar API Error:', err);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// ============================================================================
// POST /api/dashboard/calendar - Create calendar event (placeholder)
// ============================================================================
router.post('/calendar', async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, due_date } = req.body;

    // Not implemented yet - calendar events table may not exist
    res.status(501).json({ error: 'Calendar events not yet implemented' });
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// ============================================================================
// GET /api/dashboard/payment-methods - Get stored payment methods (placeholder)
// ============================================================================
router.get('/payment-methods', async (req, res) => {
  try {
    const userId = req.user.id;
    // Payment methods might not exist yet, return empty array
    res.json([]);
  } catch (err) {
    console.error('Payment Methods API Error:', err);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// ============================================================================
// GET /api/dashboard/export/:type - Export data as CSV
// ============================================================================
router.get('/export/:type', async (req, res) => {
  try {
    // Admin check
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).send('Access Denied. Admin privileges required.');
    }

    const userId = req.user.id;
    const type = req.params.type;
    let data = [];
    let filename = `incozi_${type}_export.csv`;

    if (type === 'accounting') {
      data = await Payment.find({ userId });
    } else if (type === 'entities') {
      data = []; // Not implemented
    } else if (type === 'calendar') {
      data = []; // Not implemented
    } else {
      return res.status(400).send('Invalid export type');
    }

    // Convert to CSV
    if (data.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send('No Data');
    }

    const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const obj = row.toObject ? row.toObject() : row;
      const values = headers.map(header => {
        const escaped = ('' + (obj[header] || '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvString);
  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).send('Failed to export data');
  }
});

module.exports = router;
