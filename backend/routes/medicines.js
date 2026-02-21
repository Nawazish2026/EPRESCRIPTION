// routes/medicines.js
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

/**
 * @route   GET /api/medicines
 * @desc    Fetch all medicines with optional limit/skip for pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const medicines = await Medicine.find()
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Medicine.countDocuments();

    res.status(200).json({
      success: true,
      data: medicines,
      total,
      limit,
      skip
    });
  } catch (err) {
    console.error('Fetch medicines error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/medicines/search
 * @desc    Search medicines using text index (with regex fallback)
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query || query.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Search query too short'
      });
    }

    let medicines = [];

    // Try MongoDB text search first (requires text index)
    try {
      medicines = await Medicine.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .lean();
    } catch (textErr) {
      // Text index might not exist — skip to regex fallback
      console.warn('Text search unavailable, using regex fallback:', textErr.message);
      medicines = [];
    }

    // If text search returned nothing, fallback to regex search
    if (medicines.length === 0) {
      // Escape special regex characters in the query
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      medicines = await Medicine.find({
        $or: [
          { name: { $regex: escaped, $options: 'i' } },
          { composition: { $regex: escaped, $options: 'i' } },
          { manufacturer: { $regex: escaped, $options: 'i' } }
        ]
      })
        .limit(20)
        .lean();
    }

    res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (err) {
    console.error('Search medicines error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/medicines/:id
 * @desc    Get single medicine by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).lean();

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    console.error('Fetch medicine error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;