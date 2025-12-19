// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const prescriptionRoutes = require('./routes/prescription');
const prescriptionsRoutes = require('./routes/prescriptions');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// --- sanity checks for critical env vars (optional but helpful in dev) ---
if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI is not set in .env');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in .env (required for jwt.sign)');
}

// --- middleware ---
app.use(express.json()); // <--- important: parse JSON bodies
app.use(cookieParser());

// configure CORS - allow requests from your frontend origin and allow credentials (cookies)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// --- database connection ---
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1); // fail fast in production/dev so you notice the problem
  }
}
connectDB();


// --- mount routes ---
// NOTE: frontend expects /api/auth/... so mounting at /api/auth avoids 404
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/dashboard', dashboardRoutes);

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
