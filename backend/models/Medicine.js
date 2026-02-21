const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  composition: { type: String, index: true },
  price: { type: Number },
  manufacturer: { type: String, index: true },
  type: { type: String, default: 'allopathy' },  // allopathy, ayurvedic, homeopathy, etc.
  description: { type: String },
  side_effects: { type: String },
  drug_interactions: { type: String },
  packaging: { type: String },
  isDiscontinued: { type: Boolean, default: false }
});

// Create a text index for powerful search across name, composition, and description
MedicineSchema.index({
  name: 'text',
  composition: 'text',
  description: 'text',
  manufacturer: 'text'
});

module.exports = mongoose.model('Medicine', MedicineSchema);