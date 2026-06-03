const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect(['PATIENT']), getProfile);

module.exports = router;
