const express = require('express');
const router = express.Router();
const baseurl = '/category';
const categoryController = require('../controllers/tranCategoryController');

router.post(baseurl + '/getTransactionCategoryByBudgetId', categoryController.getTransactionCategoryByBudgetId);

module.exports = router;
