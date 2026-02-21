const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');

dotenv.config({ path: path.join(__dirname, '.env') });

// Configuration
const BATCH_SIZE = 1000; // Insert 1000 records at a time
const MAX_RECORDS = 5000; // Only import first 5000 medicines
const CSV_FILE_PATH = path.join(__dirname, 'medicine_data.csv');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    importData();
  })
  .catch(err => console.error('❌ DB Error:', err));

async function importData() {
  const results = [];
  let totalInserted = 0;

  // --- Step 1: Clear existing data ---
  console.log('🗑️  Clearing old medicine data...');
  await Medicine.deleteMany({});
  console.log('✅ Old data cleared.');

  console.log('🚀 Starting import... This may take a few minutes.');

  const stream = fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv());

  for await (const row of stream) {
    // Map CSV columns to Schema fields based on actual CSV headers:
    // id,name,price(₹),Is_discontinued,manufacturer_name,type,pack_size_label,short_composition1,short_composition2

    // Combine compositions
    const composition = [row['short_composition1'], row['short_composition2']]
      .filter(c => c && c.trim())
      .join(' + ');

    // Parse price (remove ₹ symbol if present)
    const priceStr = row['price(₹)'] || row['price'] || '0';
    const price = parseFloat(priceStr.replace(/[₹,]/g, '')) || 0;

    const medicine = {
      name: row['name'],
      composition: composition,
      price: price,
      manufacturer: row['manufacturer_name'],
      type: row['type'] || 'allopathy',
      packaging: row['pack_size_label'] || '',
      isDiscontinued: row['Is_discontinued'] === 'TRUE'
    };

    // Only add if name exists and not discontinued
    if (medicine.name && !medicine.isDiscontinued) {
      results.push(medicine);
    }

    // Stop if we've reached the limit
    if (totalInserted + results.length >= MAX_RECORDS) {
      break;
    }

    // When batch is full, insert and clear memory
    if (results.length >= BATCH_SIZE) {
      try {
        await Medicine.insertMany(results, { ordered: false });
        totalInserted += results.length;
        process.stdout.write(`\r⏳ Inserted ${totalInserted} records...`);
        results.length = 0; // Clear array
      } catch (e) {
        // Skip duplicates
        if (e.code !== 11000) {
          console.error('\nError inserting batch:', e.message);
        }
        results.length = 0;
      }
    }
  }

  // Insert remaining records
  if (results.length > 0) {
    try {
      await Medicine.insertMany(results, { ordered: false });
      totalInserted += results.length;
    } catch (e) {
      if (e.code !== 11000) {
        console.error('\nError inserting final batch:', e.message);
      }
    }
  }

  console.log(`\n🎉 DONE! Successfully imported ${totalInserted} medicines.`);
  process.exit();
}