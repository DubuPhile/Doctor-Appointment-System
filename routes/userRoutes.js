const express = require('express');
const router = express.Router();
const { getApprovedDoctorController } = require('../controllers/userController')

router.get('/getApprovedDoctors', getApprovedDoctorController);

module.exports = router