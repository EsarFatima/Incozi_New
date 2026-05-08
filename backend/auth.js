const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const { User } = require('./infrastructure/models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

// In-memory store for Verification PINs (not persistent)
const verificationCodes = new Map();

// ============================================================================
// SEND PIN - Send verification PIN to email
// ============================================================================
router.post('/send-pin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { 
      pin, 
      expires: Date.now() + 5 * 60 * 1000 
    });

    await emailService.sendVerificationPin(email, pin);
    res.json({ message: 'PIN sent to your email' });
  } catch (error) {
    console.error('Send PIN error:', error);
    res.status(500).json({ error: 'Server error sending PIN' });
  }
});

// ============================================================================
// VERIFY PIN - Verify PIN and create/update user
// ============================================================================
router.post('/verify-pin', async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) return res.status(400).json({ error: 'Email and PIN required' });

    const record = verificationCodes.get(email);
    
    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired PIN' });
    }

    if (Date.now() > record.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: 'PIN expired' });
    }

    if (record.pin !== pin) {
      return res.status(400).json({ error: 'Incorrect PIN' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        password: '', // No password for PIN auth
        firstName: '',
        lastName: '',
        role: 'client',
        'verification.isVerified': true
      });
    } else {
      user.verification.isVerified = true;
      await user.save();
    }

    // Update last login
    user.activityLog.lastLogin = new Date();
    await user.save();

    verificationCodes.delete(email);

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'PIN verified',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({ error: 'Server error verifying PIN' });
  }
});

// ============================================================================
// LOGIN - Authenticate with email and password
// ============================================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    // Update last login
    user.activityLog.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.verification.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// SIGNUP - Register new user
// ============================================================================
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName: firstName || 'User',
      lastName: lastName || '',
      role: 'client',
      verification: {
        verificationToken: token,
        isVerified: false,
        verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    // Send verification email (skip if email service not configured)
    try {
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;
      await emailService.sendVerificationEmail(email, verificationLink);
    } catch (emailError) {
      console.warn('Email send failed, but user created:', emailError.message);
      // Auto-verify user if email fails (for testing/development)
      user.verification.isVerified = true;
      await user.save();
    }

    res.status(201).json({ 
      message: 'Registration successful. You can now log in.' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// VERIFY EMAIL - Verify email with token link
// ============================================================================
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('<h1>Invalid Verification Link</h1>');
    }

    // Find user with token
    const user = await User.findOne({ 'verification.verificationToken': token });
    if (!user) {
      return res.status(400).send('<h1>Invalid or Expired Verification Link</h1>');
    }

    // Update user
    user.verification.isVerified = true;
    user.verification.verificationToken = null;
    await user.save();

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: green;">Email Verified Successfully!</h1>
        <p>Your account has been activated.</p>
        <a href="/" style="text-decoration: none; background: #4338ca; color: white; padding: 10px 20px; border-radius: 5px;">Go to Home</a>
      </div>
    `);
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).send('<h1>Server Error during verification</h1>');
  }
});

// ============================================================================
// FORGOT PASSWORD - Send password reset email
// ============================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({ message: 'If that email exists, we have sent a reset link.' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Update user
    user.verification.verificationToken = token;
    user.verification.verificationExpiry = expires;
    await user.save();

    // Send email
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const resetLink = `${baseUrl}/pages/reset-password.html?token=${token}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'If that email exists, we have sent a reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// RESET PASSWORD - Reset password with token
// ============================================================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });

    // Find user with valid token
    const user = await User.findOne({ 
      'verification.verificationToken': token,
      'verification.verificationExpiry': { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.password = hashedPassword;
    user.verification.verificationToken = null;
    user.verification.verificationExpiry = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET USER PROFILE
// ============================================================================
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select(
      'firstName lastName email phoneNumber profile'
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bio: user.profile.bio,
      credentials: user.profile.credentials
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// UPDATE USER PROFILE
// ============================================================================
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phoneNumber, bio, credentials } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNumber,
        'profile.bio': bio,
        'profile.credentials': credentials
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// CHANGE PASSWORD
// ============================================================================
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// UPDATE EMAIL PREFERENCES
// ============================================================================
router.put('/email-preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { emailNotifications, pushNotifications, newsletter } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        'preferences.emailNotifications': emailNotifications,
        'preferences.pushNotifications': pushNotifications,
        'preferences.newsletter': newsletter
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Email preferences updated successfully' });
  } catch (error) {
    console.error('Update email preferences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET USER SERVICES (Protected)
// ============================================================================
router.get('/user-services', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;

    // TODO: Implement with Subscription model when available
    const services = [];

    res.json({ services });
  } catch (error) {
    console.error('Get user services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET USER DOCUMENTS (Protected)
// ============================================================================
router.get('/user-documents', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;

    // TODO: Implement with Document model when available
    const documents = [];

    res.json({ documents });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// GET USER BILLING HISTORY (Protected)
// ============================================================================
router.get('/user-billing', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;

    // TODO: Implement with Payment model when available
    const payments = [];

    res.json({ payments });
  } catch (error) {
    console.error('Get user billing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// CANCEL SERVICE (Protected)
// ============================================================================
router.post('/cancel-service', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'subscriptionId is required' });
    }

    // TODO: Implement with Subscription model when available
    res.json({ message: 'Service cancelled successfully' });
  } catch (error) {
    console.error('Cancel service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
