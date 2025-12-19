const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // You can add other fields here, e.g., description, manufacturer, etc.
  description: String,
});

module.exports = mongoose.model('Medicine', MedicineSchema);