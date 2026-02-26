// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const { logAudit } = require('../middleware/auditLogger');

// Check if Google OAuth is configured
const isGoogleOAuthConfigured = () => {
  return process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    !process.env.GOOGLE_CLIENT_SECRET.includes('YOUR_') &&
    !process.env.GOOGLE_CLIENT_SECRET.includes('_HERE');
};

// Helper: generate JWT with role
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Helper: safe user object for responses
function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profilePicture: user.profilePicture,
  };
}

// ---- Google OAuth ----
router.get('/google', (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(503).json({
      message: 'Google OAuth is not configured. Please use email/password login.',
      error: 'GOOGLE_OAUTH_NOT_CONFIGURED'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendURL}/login?error=oauth_not_configured`);
  }
  passport.authenticate('google', { failureRedirect: '/login', session: false }, (err, user) => {
    if (err || !user) {
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendURL}/login?error=oauth_failed`);
    }
    const token = generateToken(user);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
  })(req, res, next);
});

// ---- SIGNUP ----
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Allow role selection (default: doctor)
    const allowedRoles = ['doctor', 'pharmacist'];
    const userRole = allowedRoles.includes(role) ? role : 'doctor';

    const user = new User({ name, email, phone, password, role: userRole });
    await user.save();

    const token = generateToken(user);

    // Audit log
    logAudit('USER_SIGNUP', user._id, 'User', user._id, { role: userRole }, req);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---- LOGIN ----
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email or phone, and password required' });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      logAudit('USER_LOGIN_FAILED', null, 'User', null, { email, phone, reason: 'not_found' }, req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      logAudit('USER_LOGIN_FAILED', user._id, 'User', user._id, { reason: 'wrong_password' }, req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // Audit log
    logAudit('USER_LOGIN', user._id, 'User', user._id, { role: user.role }, req);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---- PROFILE ----
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---- UPDATE PROFILE ----
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    logAudit('PROFILE_UPDATED', user._id, 'User', user._id, { name, phone }, req);

    res.status(200).json({ message: 'Profile updated', user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---- LOGOUT ----
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
