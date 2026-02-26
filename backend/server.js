// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const { initSocket } = require('./config/socket');
const rateLimit = require('express-rate-limit');

// Only configure Google OAuth if REAL credentials are provided (not placeholders)
const hasValidGoogleCreds = process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('YOUR_') &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('_HERE');

if (hasValidGoogleCreds) {
  require('./config/passport')(passport);
  console.log('Google OAuth configured');
} else {
  console.warn('Warning: Google OAuth disabled (missing or placeholder credentials)');
}

const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const prescriptionRoutes = require('./routes/prescription');
const prescriptionsRoutes = require('./routes/prescriptions');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/admin');
const uploadsRoutes = require('./routes/uploads');
const notificationRoutes = require('./routes/notifications');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// --- Rate Limiting ---
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests from this IP, please try again after 15 minutes' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: 'Too many auth attempts from this IP, please try again after 15 minutes' });
const searchLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, message: 'Too many search requests, please slow down' });

// Apply global rate limiter
app.use(globalLimiter);

// --- sanity checks for critical env vars (optional but helpful in dev) ---
if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI is not set in .env');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in .env (required for jwt.sign)');
}
if (!process.env.FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL is not set in .env (defaults to http://localhost:5173)');
}

// --- middleware ---
app.use(express.json()); // <--- important: parse JSON bodies
app.use(cookieParser());

// configure CORS - allow requests from your frontend origin and allow credentials (cookies)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true, // 'true' allows the requesting origin (useful for same-domain Vercel deployments)
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// --- database connection (non-blocking - server continues even if DB fails) ---
let dbConnected = false;
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    dbConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    console.warn('Server will continue running - some features may not work');
    // Don't exit - let server run for UI testing
  }
}
connectDB();


// --- mount routes ---
// Apply strict limiters to specific paths
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/medicines', searchLimiter, medicineRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/audit-logs', auditRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/notifications', notificationRoutes);

// optional root health-check
app.get('/', (req, res) => res.send('Backend running'));

// optional: print registered routes (useful for debugging)
function printRoutes(app) {
  if (!app._router) return;
  app._router.stack.forEach(mw => {
    if (mw.route) {
      const methods = Object.keys(mw.route.methods).join(', ').toUpperCase();
      console.log(`${methods} ${mw.route.path}`);
    } else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
      // nested router (express <4.17) - skip for simplicity
    }
  });
}
printRoutes(app);

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for Vercel serverless functions
module.exports = app;
