const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/', userController.getUserNotifications);
router.patch('/:notificationId/read', userController.markNotificationAsRead)

module.exports = router