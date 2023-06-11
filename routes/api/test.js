const express = require('express');
const router = express.Router();
const testController = require('../../controllers/testController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/VerifyRoles');

router.route('/').get(testController.testLogin);
router.route('/auth').get(verifyJWT, testController.testLoginAuth);
router.route('/roles').get(verifyJWT, verifyRoles("root"), testController.testLoginAuth);

module.exports = router;