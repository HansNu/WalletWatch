const express = require('express');
const router = express.Router();
const baseurl = '/account';
const accountController = require('../controllers/accountController');

router.post(baseurl + '/getTotalBalanceByUserId', accountController.getTotalBalanceByUserId);


module.exports = router;
