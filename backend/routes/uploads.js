// routes/uploads.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const { upload, uploadToCloudinary, isCloudinaryConfigured } = require('../middleware/upload');
const { logAudit } = require('../middleware/auditLogger');

router.use(verifyToken);

/**
 * @route   POST /api/uploads/profile
 * @desc    Upload profile picture to Cloudinary
 * @access  Authenticated users
 */
router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'File upload service is not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'eprescription/profiles');

    // Update user's profile picture URL
    await User.findByIdAndUpdate(req.user.id, { profilePicture: url });

    logAudit('PROFILE_PICTURE_UPLOADED', req.user.id, 'User', req.user.id,
      { publicId, fileSize: req.file.size }, req);

    res.json({ success: true, url, publicId });
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

/**
 * @route   POST /api/uploads/prescription
 * @desc    Upload prescription-related attachment
 * @access  Doctor, Admin
 */
router.post('/prescription', upload.single('attachment'), async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'File upload service is not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'eprescription/prescriptions');

    res.json({ success: true, url, publicId });
  } catch (err) {
    console.error('Prescription upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

module.exports = router;
