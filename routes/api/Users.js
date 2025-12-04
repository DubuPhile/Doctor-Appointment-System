const express = require('express');
const router = express.Router();
const ROLE_LIST = require('../../config/roles_List');
const verifyRoles = require('../../middleware/verifyRoles');
const userController = require('../../controllers/userController')

router.route('/')
    .post(verifyRoles(ROLE_LIST.User, ROLE_LIST.Admin), userController.loginController)

module.exports = router