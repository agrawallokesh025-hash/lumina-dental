const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  cancelPatientAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  exportAppointmentsCSV,
  exportSingleAppointmentCSV,
  createPublicAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public route for unauthenticated bookings
router.post('/public', createPublicAppointment);

// Patient Routes
router.post('/book', protect(['PATIENT']), bookAppointment);
router.get('/my-appointments', protect(['PATIENT']), getPatientAppointments);
router.put('/my-appointments/:id/cancel', protect(['PATIENT']), cancelPatientAppointment);

// Admin Routes
router.get('/', protect(['ADMIN']), getAllAppointments);
router.patch('/:id/status', protect(['ADMIN']), updateAppointmentStatus);
router.get('/export', protect(['ADMIN']), exportAppointmentsCSV);
router.get('/:id/export', protect(['ADMIN']), exportSingleAppointmentCSV);

module.exports = router;
