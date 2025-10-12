const express = require('express');
const router = express.Router();
const baseurl = '/user';
const userController = require('../controllers/userController');

router.post(baseurl + '/getUserByUserId', userController.getUserByUserId);

module.exports = router;
