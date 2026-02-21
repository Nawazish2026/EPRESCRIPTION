// routes/prescriptions.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { logAudit } = require('../middleware/auditLogger');
const { emitToUser } = require('../config/socket');
const Notification = require('../models/Notification');

// All prescription routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/prescriptions
 * @desc    Create a new prescription
 * @access  Doctor, Admin
 */
router.post('/', authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { patientName, patientAge, patientEmail, diagnosis, medicines, doctorNotes } = req.body;

    if (!patientName || !patientAge || !diagnosis) {
      return res.status(400).json({ message: 'patientName, patientAge, and diagnosis are required' });
    }

    const prescription = await Prescription.create({
      patientName,
      patientAge,
      patientEmail,
      diagnosis,
      medicines: medicines || [],
      doctorNotes: doctorNotes || '',
      doctor: req.user.id,
    });

    // Audit log
    logAudit('PRESCRIPTION_CREATED', req.user.id, 'Prescription', prescription._id,
      { patientName, diagnosis, medicineCount: medicines?.length || 0 }, req);

    // Real-time notification
    const notification = await Notification.create({
      user: req.user.id,
      type: 'prescription',
      title: 'Prescription Created',
      message: `Prescription for ${patientName} (${diagnosis}) has been created.`,
    });
    emitToUser(req.user.id, 'notification', notification);

    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    console.error('Create prescription error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/prescriptions
 * @desc    List prescriptions for logged-in doctor (cursor-based pagination)
 * @access  Doctor (own), Admin (all)
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor; // Last prescription ID from previous page
    const search = req.query.search || '';
    const status = req.query.status || '';
    const from = req.query.from;
    const to = req.query.to;
    const sort = req.query.sort === 'oldest' ? 1 : -1;

    // Build filter
    let filter = {};

    // Admin sees all prescriptions, doctors see only their own
    if (req.user.role !== 'admin') {
      filter.doctor = req.user.id;
    }

    // Cursor pagination: get items before/after the cursor
    if (cursor) {
      filter._id = sort === -1 ? { $lt: cursor } : { $gt: cursor };
    }

    // Search by patient name or diagnosis
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && ['active', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    // Date range filter
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const prescriptions = await Prescription.find(filter)
      .sort({ createdAt: sort })
      .limit(limit + 1) // Fetch one extra to check if more exist
      .populate('doctor', 'name email role')
      .lean();

    const hasMore = prescriptions.length > limit;
    if (hasMore) prescriptions.pop(); // Remove the extra

    const nextCursor = prescriptions.length > 0
      ? prescriptions[prescriptions.length - 1]._id
      : null;

    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        hasMore,
        nextCursor,
        limit,
      },
    });
  } catch (err) {
    console.error('List prescriptions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/prescriptions/stats
 * @desc    Get prescription statistics for dashboard
 * @access  Doctor (own), Admin (all)
 */
router.get('/stats', async (req, res) => {
  try {
    const matchStage = req.user.role !== 'admin'
      ? { doctor: require('mongoose').Types.ObjectId.createFromHexString(req.user.id) }
      : {};

    // Patients treated this week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [treatedStats, diagnosisStats, statusStats, totalCount] = await Promise.all([
      Prescription.aggregate([
        { $match: { ...matchStage, createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Prescription.aggregate([
        { $match: { ...matchStage, diagnosis: { $exists: true, $ne: '' } } },
        { $group: { _id: '$diagnosis', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Prescription.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Prescription.countDocuments(matchStage),
    ]);

    res.json({
      success: true,
      data: { treatedStats, diagnosisStats, statusStats, totalCount },
    });
  } catch (err) {
    console.error('Prescription stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get a single prescription by ID
 * @access  Doctor (own), Admin (any)
 */
router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor', 'name email role')
      .lean();

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Only allow doctor to see their own prescriptions (admin can see all)
    if (req.user.role !== 'admin' && prescription.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PATCH /api/prescriptions/:id/status
 * @desc    Update prescription status
 * @access  Doctor (own), Admin
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (req.user.role !== 'admin' && prescription.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    prescription.status = status;
    await prescription.save();

    logAudit('PRESCRIPTION_UPDATED', req.user.id, 'Prescription', prescription._id,
      { newStatus: status }, req);

    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/prescriptions/:id
 * @desc    Delete a prescription (soft delete by setting status to cancelled)
 * @access  Doctor (own), Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (req.user.role !== 'admin' && prescription.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    prescription.status = 'cancelled';
    await prescription.save();

    logAudit('PRESCRIPTION_DELETED', req.user.id, 'Prescription', prescription._id,
      { patientName: prescription.patientName }, req);

    res.json({ success: true, message: 'Prescription cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
