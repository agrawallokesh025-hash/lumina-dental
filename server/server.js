const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, '..') });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Next.js often needs this disabled or carefully configured in dev
  }));

  // Global Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true, 
    legacyHeaders: false,
  });
  app.use('/api/', limiter); // Apply rate limiter ONLY to API routes

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/appointments', appointmentRoutes);

  // Send all other requests to Next.js
  app.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Next.js + Express running seamlessly on port ${PORT}`);
  });
});
