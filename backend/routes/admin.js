// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { logAudit } = require('../middleware/auditLogger');

// All admin routes require authentication + admin role
router.use(verifyToken, authorize('admin'));

/**
 * @route   GET /api/admin/users
 * @desc    List all users with pagination
 * @access  Admin only
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Change a user's role
 * @access  Admin only
 */
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['doctor', 'admin', 'pharmacist'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed: ${allowedRoles.join(', ')}` });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logAudit('USER_ROLE_CHANGED', req.user.id, 'User', user._id,
      { newRole: role, changedBy: req.user.id }, req);

    res.json({ success: true, message: `Role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Admin only
 */
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logAudit('USER_DELETED', req.user.id, 'User', user._id,
      { deletedEmail: user.email }, req);

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
