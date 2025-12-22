const express = require('express');
const router = express.Router();
const {getDoctorInfoController} = require ('../controllers/doctorController');

//get all users
router.post('/getDoctorInfo', getDoctorInfoController);

module.exports = router