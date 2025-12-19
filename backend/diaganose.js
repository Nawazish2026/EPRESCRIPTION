require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔍 STARTING SYSTEM DIAGNOSTICS...');
console.log('==================================');

// 1. CHECK ENVIRONMENT VARIABLES
console.log('\n1️⃣  Checking .env Configuration:');
if (!process.env.JWT_SECRET) {
    console.error('❌  CRITICAL ERROR: JWT_SECRET is missing from .env file.');
} else {
    console.log('✅  JWT_SECRET is found.');
}

if (!process.env.MONGO_URI) {
    console.error('❌  CRITICAL ERROR: MONGO_URI is missing from .env file.');
} else {
    console.log('✅  MONGO_URI is found.');
}

// 2. CHECK DEPENDENCIES
console.log('\n2️⃣  Checking Installed Libraries:');
try {
    require('bcryptjs');
    console.log('✅  bcryptjs is installed.');
} catch (e) {
    console.error('❌  CRITICAL ERROR: bcryptjs is NOT installed. Run: npm install bcryptjs');
}

try {
    require('jsonwebtoken');
    console.log('✅  jsonwebtoken is installed.');
} catch (e) {
    console.error('❌  CRITICAL ERROR: jsonwebtoken is NOT installed. Run: npm install jsonwebtoken');
}

try {
    require('cors');
    console.log('✅  cors is installed.');
} catch (e) {
    console.error('❌  CRITICAL ERROR: cors is NOT installed. Run: npm install cors');
}

// 3. CHECK DATABASE CONNECTION
console.log('\n3️⃣  Testing Database Connection...');
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('✅  MongoDB Connected Successfully!');
            console.log('\n✨ DIAGNOSTICS COMPLETE. If you see any ❌ above, fix them first!');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌  MongoDB Connection Failed:', err.message);
            process.exit(1);
        });
} else {
    console.log('Skipping DB test due to missing URI.');
}