const express = require('express')
const { loginController } = require('../controllers/userController')

//router object
const router = express.Router()

//routes
//Login || Post
router.post ('/', loginController)


module.exports = router