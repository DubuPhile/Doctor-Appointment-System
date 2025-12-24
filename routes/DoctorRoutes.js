const express = require('express');
const router = express.Router();
const {getDoctorInfoController, updateProfileController, getDoctorIdController } = require ('../controllers/doctorController');

//get all users
router.post('/getDoctorInfo', getDoctorInfoController);

router.post('/updateProfile', updateProfileController);

router.get('/getDoctorId', getDoctorIdController);

module.exports = router