const express = require('express');
const router = express.Router();
const {
    getDoctorInfoController, 
    updateProfileController, 
    getDoctorIdController, 
    getDoctorAppointmentsController,
} = require ('../controllers/doctorController');

//get all users
router.post('/getDoctorInfo', getDoctorInfoController);

router.post('/updateProfile', updateProfileController);

router.get('/getDoctorId', getDoctorIdController);

router.get('/doctor-appointments', getDoctorAppointmentsController)
module.exports = router