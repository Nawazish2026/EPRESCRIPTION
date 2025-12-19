
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const auth = require('../middleware/auth');

// @route   POST api/prescriptions
// @desc    Create a new prescription
// @access  Private
router.post('/', auth, async (req, res) => {
  const { patientName, patientAge, diagnosis, medicines, doctorNotes } = req.body;
  
  try {
    const newPrescription = new Prescription({
      patientName,
      patientAge,
      diagnosis,
      medicines,
      doctorNotes,
      doctor: req.user.id,
    });

    const prescription = await newPrescription.save();
    res.json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
