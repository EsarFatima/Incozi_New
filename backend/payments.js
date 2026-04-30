const express = require('express');
const router = express.Router();
const paymentService = require('./paymentService');
const emailService = require('./emailService');
const { User, Subscription, Payment, Service } = require('./infrastructure/models');

// ============================================================================
// POST /api/payments/checkout - Process payment checkout
// ============================================================================
router.post('/checkout', async (req, res) => {
  try {
    const { userId, planId, amount, currency, paymentMethod, itemName } = req.body;

    // Validate input
    if (!userId || !planId || !amount) {
      return res.status(400).json({ error: 'Missing required checkout details.' });
    }

    // 1. Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Invalid User ID' });
    }

    // 2. Fetch service/plan (if planId is a service ID, fetch the service)
    let service = null;
    try {
      service = await Service.findById(planId);
    } catch (err) {
      // planId might not be a valid service ID, continue anyway
      console.warn('Could not fetch service for plan:', planId);
    }

    if (!service && !itemName) {
      return res.status(400).json({ error: 'Invalid Plan ID' });
    }

    // 3. Generate short order ID
    const shortOrderId = 'OR' + Date.now() + Math.floor(Math.random() * 10000);

    // 4. Create pending subscription
    const subscription = await Subscription.create({
      userId,
      serviceId: planId,
      status: 'pending',
      startDate: new Date(),
      itemName: itemName || (service ? service.name : null),
      gatewayRef: shortOrderId,
      amount,
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'stripe'
    });

    // 5. Call Payment Gateway (AsaanPay/Stripe)
    const paymentResult = await paymentService.initiatePayment(
      amount,
      shortOrderId,
      {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    );

    // 6. Handle gateway response
    if (paymentResult.success) {
      return res.status(200).json({
        message: 'Payment Initiated',
        redirectUrl: paymentResult.redirectUrl,
        subscriptionId: shortOrderId
      });
    } else {
      throw new Error(paymentResult.error || 'Payment Gateway Failed');
    }
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
});

// ============================================================================
// POST /api/payments/verify-status - Verify payment status with gateway
// ============================================================================
router.post('/verify-status', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Check status with gateway
    const result = await paymentService.checkPaymentStatus(orderId);

    // If payment completed
    if (result.status === 'completed' || result.status === 'success' || result.status === 'paid') {
      // 1. Find subscription by gateway reference
      let sub = await Subscription.findOne({ gatewayRef: orderId }).populate('userId');

      if (!sub) {
        // Fallback: try as UUID
        sub = await Subscription.findById(orderId).populate('userId');
      }

      if (!sub) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      const user = sub.userId;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 2. Activate subscription
      sub.status = 'active';
      sub.activatedAt = new Date();
      await sub.save();

      // 3. Log payment
      const payment = await Payment.create({
        userId: sub.userId._id,
        subscriptionId: sub._id,
        amount: result.transactionAmount || sub.amount || 0,
        paymentStatus: 'success',
        paymentProvider: paymentService.PROVIDER_NAME || 'stripe',
        transactionId: orderId,
        currency: sub.currency || 'USD'
      });

      // 4. Send emails
      if (user) {
        const isConsultation = sub.itemName && sub.itemName.includes('Consultation');

        const orderDetails = {
          transactionId: orderId,
          planName: sub.itemName,
          currency: sub.currency || 'USD',
          amount: sub.amount,
          customerName: `${user.firstName} ${user.lastName}`,
          customerEmail: user.email
        };

        if (isConsultation) {
          // Consultation-specific emails
          try {
            await emailService.sendConsultationPurchaseConfirmation(user.email, sub.itemName);
            console.log('Consultation user email sent');
          } catch (e) {
            console.error('Failed to send consultation user email:', e);
          }

          try {
            await emailService.sendConsultationPurchaseAdmin(user, sub.itemName);
            console.log('Consultation admin email sent');
          } catch (e) {
            console.error('Failed to send consultation admin email:', e);
          }
        } else {
          // Standard purchase emails
          try {
            await emailService.sendPurchaseConfirmation(user.email, orderDetails);
            console.log('Order confirmation sent to buyer');
          } catch (e) {
            console.error('Failed to send buyer email:', e);
          }

          try {
            await emailService.sendNewOrderNotificationToAdmin(orderDetails);
            console.log('Order notification sent to admin');
          } catch (e) {
            console.error('Failed to send admin email:', e);
          }
        }
      }

      return res.json({ status: 'active' });
    }

    res.json({ status: 'pending' });
  } catch (err) {
    console.error('Verify status error:', err);
    res.status(500).json({ error: 'Check failed' });
  }
});

module.exports = router;
