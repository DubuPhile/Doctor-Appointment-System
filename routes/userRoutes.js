const express = require('express');
const router = express.Router();
const { getApprovedDoctorController, bookAppointmentController, bookAvailabilityController } = require('../controllers/userController')

//get Approved Doctors
router.get('/getApprovedDoctors', getApprovedDoctorController);

//Book Appointment
router.post('/book-appointment', bookAppointmentController);
// book available
router.post('/book-availability', bookAvailabilityController);

module.exports = router