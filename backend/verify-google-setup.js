#!/usr/bin/env node
// verify-google-setup.js
// Run this to verify your Google OAuth setup
require('dotenv').config();

console.log('\n🔍 Google OAuth Setup Verification\n');
console.log('='.repeat(50));

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const frontendOrigin = process.env.FRONTEND_ORIGIN;

let errors = 0;
let warnings = 0;

// Check Client ID
console.log('\n1. Checking GOOGLE_CLIENT_ID...');
if (!clientId) {
  console.log('   ❌ NOT SET');
  errors++;
} else if (clientId === 'ADD_YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.log('   ❌ Still using placeholder value');
  console.log('   📝 Action: Replace with your actual Client ID from Google Console');
  errors++;
} else if (!clientId.includes('.apps.googleusercontent.com')) {
  console.log('   ⚠️  WARNING: Client ID format looks incorrect');
  console.log('   Expected format: 123456789-xxx.apps.googleusercontent.com');
  console.log('   Your value:', clientId);
  warnings++;
} else {
  console.log('   ✅ Looks good!');
  console.log('   Value:', clientId.substring(0, 30) + '...');
}

// Check Client Secret
console.log('\n2. Checking GOOGLE_CLIENT_SECRET...');
if (!clientSecret) {
  console.log('   ❌ NOT SET');
  errors++;
} else if (clientSecret === 'ADD_YOUR_GOOGLE_CLIENT_SECRET_HERE') {
  console.log('   ❌ Still using placeholder value');
  console.log('   📝 Action: Replace with your actual Client Secret from Google Console');
  errors++;
} else if (!clientSecret.startsWith('GOCSPX-')) {
  console.log('   ⚠️  WARNING: Client Secret format looks incorrect');
  console.log('   Expected format: GOCSPX-xxxxxxxxxxxxx');
  console.log('   Your value:', clientSecret.substring(0, 20) + '...');
  warnings++;
} else {
  console.log('   ✅ Looks good!');
  console.log('   Value:', clientSecret.substring(0, 15) + '...');
}

// Check Frontend Origin
console.log('\n3. Checking FRONTEND_ORIGIN...');
if (!frontendOrigin) {
  console.log('   ⚠️  NOT SET (will default to http://localhost:5173)');
  warnings++;
} else {
  console.log('   ✅ Set to:', frontendOrigin);
}

// Check OAuth endpoints
console.log('\n4. OAuth Flow Endpoints:');
console.log('   📍 Login initiation: http://localhost:5001/api/auth/google');
console.log('   📍 Callback URL: http://localhost:5001/api/auth/google/callback');
console.log('   📍 Redirect after auth:', frontendOrigin || 'http://localhost:5173');

// Google Console checklist
console.log('\n5. Google Cloud Console Checklist:');
console.log('   Make sure you have configured in Google Console:');
console.log('   □ Authorized JavaScript origins:');
console.log('     - http://localhost:5173');
console.log('     - http://localhost:5001');
console.log('   □ Authorized redirect URIs:');
console.log('     - http://localhost:5001/api/auth/google/callback');
console.log('   □ OAuth consent screen configured');
console.log('   □ Added yourself as test user');

// Summary
console.log('\n' + '='.repeat(50));
if (errors > 0) {
  console.log('\n❌ SETUP INCOMPLETE');
  console.log(`   Found ${errors} error(s) and ${warnings} warning(s)`);
  console.log('\n📖 Next steps:');
  console.log('   1. Follow SETUP_GOOGLE_CREDENTIALS.md');
  console.log('   2. Get credentials from https://console.cloud.google.com/');
  console.log('   3. Update backend/.env with your actual values');
  console.log('   4. Run this script again to verify');
} else if (warnings > 0) {
  console.log('\n⚠️  SETUP NEEDS ATTENTION');
  console.log(`   Found ${warnings} warning(s)`);
  console.log('   Review the warnings above and fix if needed');
} else {
  console.log('\n✅ SETUP LOOKS GOOD!');
  console.log('\n🚀 Ready to test:');
  console.log('   1. Start backend: npm start');
  console.log('   2. Start frontend: cd ../frontend && npm run dev');
  console.log('   3. Visit: http://localhost:5173');
  console.log('   4. Click "Sign in with Google"');
}

console.log('');