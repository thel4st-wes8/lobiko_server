const express = require('express');
const router = express.Router();
const rolesController = require('../../controllers/rolesController');

router.route('/').get(rolesController.handleGetRoles);

module.exports = router;