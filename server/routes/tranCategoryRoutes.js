const express = require('express');
const router = express.Router();
const baseurl = '/category';
const categoryController = require('../controllers/tranCategoryController');

router.post(baseurl + '/getTransactionCategoryByBudgetId', categoryController.getTransactionCategoryByBudgetId);
router.post(baseurl + '/addNewTransactionCategory', categoryController.addNewTransactionCategory);
router.post(baseurl + '/updateTransactionCategory', categoryController.updateTransactionCategory);
router.post(baseurl + '/deleteTransactionCategory', categoryController.deleteTransactionCategory);

module.exports = router;
