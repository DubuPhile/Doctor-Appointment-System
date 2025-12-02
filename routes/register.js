const express = require('express')
const { registerController } = require('../controllers/userController')

//router object
const router = express.Router()

router.post ('/', registerController)

module.exports = router