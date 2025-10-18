const express = require('express');
const router = express.Router();
const baseurl = '/transaction';
const transactionController = require('../controllers/transactionController');

router.post(baseurl + '/getIncomeExpenseByUserIdAndTransactionType', transactionController.getIncomeExpenseByUserIdAndTransactionType);
router.post(baseurl + '/getLatestTransactionRecord', transactionController.getLatestTransactionRecord);
router.post(baseurl + '/addNewTransaction', transactionController.addNewTransaction);

module.exports = router;
