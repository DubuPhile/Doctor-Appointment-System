const express = require('express');
const router = express.Router();
const { 
    getApprovedDoctorController, 
    bookAppointmentController, 
    bookAvailabilityController,
    userAppointmentsController,
} = require('../controllers/userController')

//get Approved Doctors
router.get('/getApprovedDoctors', getApprovedDoctorController);

//Book Appointment
router.post('/book-appointment', bookAppointmentController);
// book available
router.post('/book-availability', bookAvailabilityController);
//Appointments List
router.get('/user-appointments', userAppointmentsController);
module.exports = router