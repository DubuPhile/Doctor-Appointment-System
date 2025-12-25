const express = require('express');
const router = express.Router();
const { getApprovedDoctorController, bookAppointmentController } = require('../controllers/userController')

//get Approved Doctors
router.get('/getApprovedDoctors', getApprovedDoctorController);

//Book Appointment
router.post('/book-appointment', bookAppointmentController);

module.exports = router