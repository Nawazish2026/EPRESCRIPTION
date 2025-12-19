// seed-medicines.js
// Run this to populate the database from the CSV file.
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const Medicine = require('./models/Medicine');

// Configuration
const BATCH_SIZE = 1000; // Process 1000 records at a time
const CSV_FILE_PATH = 'medicine_data.csv'; // Path to your CSV file

async function seedMedicines() {
  try {
    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`❌ Error: CSV file not found at ${CSV_FILE_PATH}`);
      console.error('Please make sure medicine_data.csv is in the backend directory.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing medicines
    console.log('Clearing existing medicines...');
    await Medicine.deleteMany({});
    console.log('✅ Existing medicines cleared.');

    // Start seeding from CSV
    console.log(`🚀 Starting to seed medicines from ${CSV_FILE_PATH}... This may take a few minutes.`);
    
    const results = [];
    let totalInserted = 0;
    const MAX_RECORDS = 5001; // Limit to 5,001 records

    const stream = fs.createReadStream(CSV_FILE_PATH).pipe(csv());

    for await (const row of stream) {
      // Stop reading from the stream if we've collected enough records to reach the max limit
      if (totalInserted + results.length >= MAX_RECORDS) {
        break;
      }

      const medicine = {
        name: row['product_name'],
        composition: row['salt_composition'],
        // The price field in the CSV can contain currency symbols (like ₹) and commas.
        // This regex removes all non-numeric characters except for the decimal point
        // to extract a clean number. The price is stored unit-less in the database.
        price: parseFloat(String(row['product_price']).replace(/[^0-9.]+/g, '')) || 0,
        manufacturer: row['product_manufacturer'],
        description: row['medicine_desc'],
        side_effects: row['side_effects'],
        drug_interactions: row['drug_interactions'],
        packaging: row['pack_size_label'] || ''
      };

      if (medicine.name) {
        results.push(medicine);
      }

      if (results.length >= BATCH_SIZE) {
        await Medicine.insertMany(results);
        totalInserted += results.length;
        process.stdout.write(`\r⏳ Inserted ${totalInserted} records...`);
        results.length = 0; // Clear array for next batch
      }
    }

    // Insert any remaining records, ensuring we don't exceed MAX_RECORDS
    if (results.length > 0 && totalInserted < MAX_RECORDS) {
      const remainingSpace = MAX_RECORDS - totalInserted;
      const toInsert = results.slice(0, remainingSpace);
      await Medicine.insertMany(toInsert);
      totalInserted += toInsert.length;
    }

    console.log(`\n🎉 DONE! Successfully seeded ${totalInserted} medicines.`);
    
  } catch (err) {
    console.error('\n❌ Error during seeding process:', err.message);
    process.exit(1);
  } finally {
    // Ensure connection is always closed
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed.');
    }
  }
}

seedMedicines();