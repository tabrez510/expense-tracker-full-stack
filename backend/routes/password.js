const express = require('express');
const userAuthentication = require('../middleware/auth');
const forgotpasswordController = require('../controllers/forgotPassword');
const router = express.Router();

router.post('/password/forgotpassword', forgotpasswordController.forgotPassword);

module.exports = router;