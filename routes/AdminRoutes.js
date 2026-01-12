const express = require('express');
const router = express.Router();
const adminController = require ('../controllers/adminController');

//get all users
router.get('/getAllUsers', adminController.getAllUsersController);

// get all doctors
router.get('/getAllDoctors', adminController.getAllDoctorsController);

router.post('/changeAccountStatus', adminController.changeAccountStatusController)

//get all Appointments
router.get('/getAllAppointments', adminController.getAllAppointments) 
router.delete('/delete-appointment', adminController.deleteAppointments) 

module.exports = router