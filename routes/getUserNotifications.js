const express = require('express');
const router = express.Router();
const { getUserNotifications } = require('../controllers/userController')

router.get('/', getUserNotifications);

module.exports = router