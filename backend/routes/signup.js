const express = require('express');
const router = express.Router();

const signupControllers = require('../controllers/signup');

router.post('/user/signup/check-email', signupControllers.checkEmail);
router.post('/user/signup', signupControllers.createUser);

module.exports = router;