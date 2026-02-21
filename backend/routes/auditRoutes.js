// routes/auditRoutes.js
const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All audit routes require admin access
router.use(verifyToken, authorize('admin'));

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get paginated audit logs with filters
 * @access  Admin only
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);
    const skip = (page - 1) * limit;
    const { action, userId, from, to } = req.query;

    let filter = {};

    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email role')
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
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
 * @route   GET /api/admin/audit-logs/actions
 * @desc    Get list of distinct action types (for filter dropdowns)
 * @access  Admin only
 */
router.get('/actions', async (req, res) => {
  try {
    const actions = await AuditLog.distinct('action');
    res.json({ success: true, data: actions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
