const express = require('express');
const router = express.Router();
const {getDoctorInfoController, updateProfileController } = require ('../controllers/doctorController');

//get all users
router.post('/getDoctorInfo', getDoctorInfoController);

router.post('/updateProfile', updateProfileController);

module.exports = router