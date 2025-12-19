
require('dotenv').config();
const mongoose = require('mongoose');

async function verifyDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
}

verifyDB();
