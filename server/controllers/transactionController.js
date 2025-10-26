// controller/transactionController.js
const transactionService = require('../service/transactionService');

class TransactionController {
  async getIncomeExpenseByUserIdAndTransactionType(req, res) {
    try {
      const reqInEx= req.body;

      if (!reqInEx) {
        return res.status(400).json({ message: 'Invalid request' });
      }

      const total = await transactionService.getIncomeExpenseByUserIdAndTransactionType(reqInEx);

      return res.status(200).json({ total });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getLatestTransactionRecord(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const transactions = await transactionService.getLatestTransactionRecord(userId);
      return res.status(200).json(transactions);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getTransactionBasedOnUserIdAndDateRange(req, res){
    const reqObj = req.body;

    const total = await transactionService.getTransactionBasedOnUserIdAndDateRange(reqObj);

    return res.status(200).json(total);
  }

  async addNewTransaction(req, res) {
    try {
      const record = req.body;

      if (!record || !record.userId || !record.transactionAmount || !record.transactionType) {
        return res.status(400).json({ message: 'Missing required fields in request body' });
      }

      const newTransaction = await transactionService.addNewTransaction(record);
      return res.status(201).json({
        message: 'Transaction added successfully',
        data: newTransaction
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
  

  // async getLatestIncomeByAccount(req, res) {
  //   try {
  //     const { accountId } = req.body;
  //     if (!accountId) return res.status(400).json({ message: 'accountId required' });
  //     const income = await transactionService.getLatestIncome(accountId);
  //     return res.status(200).json(income);
  //   } catch (err) {
  //     return res.status(400).json({ message: err.message });
  //   }
  // }
}

module.exports = new TransactionController();