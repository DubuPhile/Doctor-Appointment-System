const express = require('express');
const router = express.Router();
const { firebaseLogin, setPasswordFirebase } = require('../controllers/firebaseController');
//log-in using firebase
router.post('/firebase', firebaseLogin);

//set a password for firebase
router.post('/set-password', setPasswordFirebase);

module.exports = router;