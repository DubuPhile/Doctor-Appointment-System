const express = require('express');
const router = express.Router();
const { applyDoctorController } = require('../controllers/userController')

router.post('/', applyDoctorController);

module.exports = router