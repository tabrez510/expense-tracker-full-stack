const express = require('express');

const userAuthenticaton = require('../middleware/auth');
const premiumFeaturesController = require('../controllers/premiumFeatures');
const router = express.Router();

router.get('/show-leaderboard', userAuthenticaton.authenticate, premiumFeaturesController.getUserLeaderboard);

module.exports = router;