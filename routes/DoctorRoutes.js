const express = require('express');
const router = express.Router();
const {
    getDoctorInfoController, 
    updateProfileController, 
    getDoctorIdController, 
    getDoctorAppointmentsController,
    updateStatusController,
} = require ('../controllers/doctorController');

//get all users
router.post('/getDoctorInfo', getDoctorInfoController);
//Update Profile
router.put('/updateProfile', updateProfileController);
//get Doctor ID
router.get('/getDoctorId', getDoctorIdController);
//get Doctor appointments
router.get('/doctor-appointments', getDoctorAppointmentsController)
router.get('/getDoctorId', getDoctorIdController);
//update status
router.put('/update-status', updateStatusController)
module.exports = router