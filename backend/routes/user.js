const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user');

router.post('/signup/check-email', userControllers.checkEmail);
router.post('/signup', userControllers.createUser);
router.post('/signin', userControllers.checkPassword);

module.exports = router;