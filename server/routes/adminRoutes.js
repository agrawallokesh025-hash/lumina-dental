const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtpAndUpdate, createPatient, getPatients, updatePatient } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// OTP & Settings
router.post('/request-otp', protect(['ADMIN']), requestOtp);
router.post('/verify-otp', protect(['ADMIN']), verifyOtpAndUpdate);

// Patient Management
router.post('/patients', protect(['ADMIN']), createPatient);
router.get('/patients', protect(['ADMIN']), getPatients);
router.put('/patients/:id', protect(['ADMIN']), updatePatient);

module.exports = router;
