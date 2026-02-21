// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications (paginated)
 * @access  Authenticated
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const cursor = req.query.cursor;

    let filter = { user: req.user.id };
    if (cursor) {
      filter._id = { $lt: cursor };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = notifications.length > limit;
    if (hasMore) notifications.pop();

    res.json({
      success: true,
      data: notifications,
      pagination: {
        hasMore,
        nextCursor: notifications.length > 0 ? notifications[notifications.length - 1]._id : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Authenticated
 */
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, read: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Authenticated
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Authenticated
 */
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
