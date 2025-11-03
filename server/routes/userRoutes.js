const express = require('express');
const router = express.Router();
const baseurl = '/user';
const userController = require('../controllers/userController');

router.post(baseurl + '/getUserByUserId', userController.getUserByUserId);
router.post(baseurl + '/updateUserData', userController.updateUserData);

module.exports = router;
