const express = require('express');
const router = express.Router();
const adminController = require ('../controllers/adminController');

//get all users
router.get('/getAllUsers', adminController.getAllUsersController);

// get all doctors
router.get('/getAllDoctors', adminController.getAllDoctorsController);

module.exports = router