const express = require('express');
const router = express.Router();
const baseurl = '/user';
const userController = require('../controllers/userController');

router.post(baseurl + '/getUserByUserId', userController.getUserByUserId);
router.post(baseurl + '/registerUser', userController.registerUser);

module.exports = router;
