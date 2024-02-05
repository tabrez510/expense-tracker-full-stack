const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user');
const userAuthentication = require('../middleware/auth');

router.post('/signup/check-email', userControllers.checkEmail);
router.post('/signup', userControllers.createUser);
router.post('/signin', userControllers.checkPassword);
router.get('/loggedin-user', userAuthentication.authenticate, userControllers.getUserDetails);

module.exports = router;