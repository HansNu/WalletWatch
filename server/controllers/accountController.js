const accountService = require('../service/accountService');
const transactionService = require('../service/transactionService'); // 👈 use service, not controller

class AccountController {
  async getAccountByUserId(req, res) {
    try {
      const reqUser = req.body;
      if (!reqUser) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const accounts = await accountService.getAccountByUserId(reqUser);
      return res.status(200).json(accounts);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getTotalBalanceByUserId(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const totalBalance = await accountService.getTotalBalanceByUserId(userId);
      return res.status(200).json({ totalBalance });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async updateIncomeByAccountId(req, res) {
    try {
      const { accountId } = req.body;
      if (!accountId) {
        return res.status(400).json({ message: 'accountId is required' });
      }

      const latestIncome = await transactionService.getLatestIncome(accountId);
      if (!latestIncome) {
        return res.status(404).json({ message: 'No income found for this account' });
      }

      const updatedAccount = await accountService.updateIncomeByAccountId(accountId, latestIncome);
      return res.status(200).json(updatedAccount);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new AccountController();