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
      .eq('user_id', userId).neq('account_category', "Credit");

    if (error) {
      throw new Error(error.message || 'Failed to fetch balances');
    }

    const total = data.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    return total;
  }

  async getLiabilitiesByUserId(userId) {
    if (!userId) {
      throw new Error('userId is required');
    }

    const { data, error } = await supabase
      .from('money_account')
      .select('balance')
      .eq('user_id', userId).eq('account_category', "Credit");

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

  async deleteAccountByAccountId(accountId) {
    if (!accountId) {
      throw new Error('userId is required');
    }

    const { error } = await supabase
      .from('money_account')
      .delete()
      .eq('account_id', accountId);

    if (error) {
      return {
        message: `Failed to delete Account`,
        error: error
      };
    }

    return {
      message: `Account deleted successfully`
    };
  }

  async addNewAccount(accData) {
    if(!accData){
      return {message : `Invalid Data`};
    }
    const { data, error } = await supabase
      .from('money_account')
      .insert([
        { 
          account_name: accData.accountName, 
          account_category: accData.accountCategory,
          balance: accData.balance,
          user_id: accData.userId
        },
      ])
      .select();

      if(error){
        return {
          message : error
        }
      }

      return {
        message : `Account Added Successfully`,
        account : data
      }
  }
}

module.exports = new AccountService();