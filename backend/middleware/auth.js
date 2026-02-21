// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies JWT token and attaches full user info (including role) to req.user.
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to get current role (in case it was changed by admin)
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'doctor',
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;