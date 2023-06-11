const express = require('express');
const router = express.Router();
const authenticationController = require('../../controllers/authenticationController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/').get(verifyJWT,authenticationController.isLoggedin);
router.route('/login').post(authenticationController.handleLogin);
router.route('/logout').post(authenticationController.handleLogout);
router.route('/refresh').get(authenticationController.handleRefreshToken);

module.exports = router;