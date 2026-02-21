// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientEmail: { type: String },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicines: [
    {
      name: String,
      composition: String,
      dosage: String,
      frequency: String,
      duration: String,
      quantity: { type: Number, default: 1 },
      price: Number,
    },
  ],
  diagnosis: { type: String, required: true },
  doctorNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for efficient doctor-based queries
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ patientName: 'text', diagnosis: 'text' });

// Update `updatedAt` on save
prescriptionSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
