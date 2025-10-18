const supabase = require('./supabaseClient');

class AccountService {
  async getAccountByUserId(reqUser) {
    if (!reqUser) {
      throw new Error('userId is required');
    }

    const { data, error } = await supabase
      .from('money_account')
      .select('*')
      .eq('user_id', reqUser.userId);

    if (error) {
      throw new Error(error.message || 'Failed to fetch accounts');
    }

    return data;
  }

  async getTotalBalanceByUserId(userId) {
    if (!userId) {
      throw new Error('userId is required');
    }

    const { data, error } = await supabase
      .from('money_account')
      .select('balance')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message || 'Failed to fetch balances');
    }

    const total = data.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    return total;
  }

  async updateIncomeByAccountId(accountId, latestIncome) {
    if (!accountId || !latestIncome) {
      throw new Error('accountId and latestIncome are required');
    }

    const accounts = await this.getAccountByUserId(latestIncome.user_id);
    const account = accounts.find(acc => acc.id === accountId) || accounts[0];

    if (!account) {
      throw new Error('Account not found');
    }

    const newBalance = latestIncome.transaction_amount + account.balance;

    const { data, error } = await supabase
      .from('money_account')
      .update({ balance: newBalance })
      .eq('id', accountId) // ⚠️ Make sure this matches your PK (is it 'id' or 'account_id'?)
      .select();

    if (error) {
      throw new Error(error.message || 'Failed to update balance');
    }

    return data[0];
  }
}

module.exports = new AccountService();