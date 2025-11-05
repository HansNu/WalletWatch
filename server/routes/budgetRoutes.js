const express = require('express');
const router = express.Router();
const baseurl = '/budget';
const budgetController = require('../controllers/budgetController');

router.post(baseurl + '/getBudgetByBudgetId', budgetController.getBudgetByBudgetId);
router.post(baseurl + '/getBudgetByUserId', budgetController.getBudgetByUserId);
router.post(baseurl + '/addNewBudget', budgetController.addNewBudget);
router.post(baseurl + '/updateBudget', budgetController.updateBudget);

module.exports = router;
