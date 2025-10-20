const express = require('express');
const router = express.Router();
const baseurl = '/account';
const accountController = require('../controllers/accountController');

//get
router.post(baseurl + '/getTotalBalanceByUserId', accountController.getTotalBalanceByUserId);
router.post(baseurl + '/getLiabilitiesByUserId', accountController.getLiabilitiesByUserId);
router.post(baseurl + '/getAccountByUserId', accountController.getAccountByUserId);

//update
router.post(baseurl + '/updateIncomeByAccountId', accountController.updateIncomeByAccountId);
router.post(baseurl + '/deleteAccountByAccountId', accountController.deleteAccountByAccountId);
router.post(baseurl + '/addNewAccount', accountController.addNewAccount);

module.exports = router;
