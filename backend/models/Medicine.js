const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // Matches 'product_name'
  composition: { type: String, index: true },          // Matches 'salt_composition'
  price: { type: Number },                             // Matches 'product_price'
  manufacturer: { type: String, index: true },         // Matches 'product_manufacturer'
  description: { type: String },                       // Matches 'medicine_desc'
  side_effects: { type: String },                      // Matches 'side_effects'
  drug_interactions: { type: String },                 // Matches 'drug_interactions'
  packaging: { type: String },                         // Optional: Keep if you have a packaging column
});

// Create a text index for powerful search across name, composition, and description
MedicineSchema.index({ 
  name: 'text', 
  composition: 'text', 
  description: 'text',
  manufacturer: 'text' 
});

module.exports = mongoose.model('Medicine', MedicineSchema);