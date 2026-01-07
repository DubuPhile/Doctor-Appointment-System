const express = require('express');
const router = express.Router();
const { firebaseLogin } = require('../controllers/firebaseController');

router.post('/firebase', firebaseLogin);

module.exports = router;