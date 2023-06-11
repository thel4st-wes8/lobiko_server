const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/').get(usersController.handleGetUsers);
router.route('/users').get(usersController.handleGetUsers);
router.route('/register').post(verifyJWT, usersController.handleCreateUser);
router.route('/delete').delete(verifyJWT, usersController.handleDeleteUser);
router.route('/current').get(verifyJWT,usersController.handleGetCurrentUser);

module.exports = router;