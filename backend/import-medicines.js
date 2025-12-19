const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');

dotenv.config();

// Configuration
const BATCH_SIZE = 1000; // Insert 1000 records at a time
const CSV_FILE_PATH = 'medicine_data.csv'; // Ensure this matches your actual filename

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    importData();
  })
  .catch(err => console.error('❌ DB Error:', err));

async function importData() {
  const results = [];
  let totalInserted = 0;

  console.log('🚀 Starting import... This may take a few minutes.');

  const stream = fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv());

  for await (const row of stream) {
    // Map CSV columns to Schema fields based on your screenshot
    const medicine = {
      name: row['product_name'], 
      composition: row['salt_composition'],
      price: parseFloat(row['product_price']) || 0,
      manufacturer: row['product_manufacturer'],
      description: row['medicine_desc'],
      side_effects: row['side_effects'],
      drug_interactions: row['drug_interactions'],
      packaging: row['pack_size_label'] || '' // Optional, if exists
    };

    // Only add if name exists
    if (medicine.name) {
      results.push(medicine);
    }

    // When batch is full, insert and clear memory
    if (results.length >= BATCH_SIZE) {
      try {
        await Medicine.insertMany(results);
        totalInserted += results.length;
        process.stdout.write(`\r⏳ Inserted ${totalInserted} records...`);
        results.length = 0; // Clear array
      } catch (e) {
        console.error('Error inserting batch:', e.message);
      }
    }
  }

  // Insert remaining records
  if (results.length > 0) {
    await Medicine.insertMany(results);
    totalInserted += results.length;
  }

  console.log(`\n🎉 DONE! Successfully imported ${totalInserted} medicines.`);
  process.exit();
}