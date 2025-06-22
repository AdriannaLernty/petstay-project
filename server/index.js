const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 5000;

// Load env & DB
require('dotenv').config();
const db = require('./db');
require('./config/passport');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Static folder
const fullUploadsPath = path.resolve(__dirname, "uploads");
app.use("/uploads", express.static(fullUploadsPath));

// ✅ Routes Registration
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const petRoutes = require('./routes/petRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// ✅ Use Routes
app.use('/api/auth', authRoutes);             // Login, Register, Google OAuth
app.use('/api/services', serviceRoutes);      // Services list
app.use('/api', bookingRoutes);               // /bookings/:userId etc
app.use('/api', feedbackRoutes);              // /feedback routes
app.use('/api', petRoutes);                   // /pet routes
app.use('/api/admin', adminRoutes);           // Admin-only dashboard routes
app.use('/api', profileRoutes);               // /profile/:userId
app.use('/api/payments', paymentRoutes);      // Payment upload & history

// ✅ Root & Test Routes
app.get('/', (req, res) => {
  res.send('PetStay backend is working!');
});

app.get("/api/payments/test-direct", (req, res) => {
  res.send("✅ Direct test route works.");
});

// ✅ Google OAuth Redirect Handler
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:3000/login?token=${token}&name=${encodeURIComponent(user.name)}&email=${user.email}`);
  }
);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
