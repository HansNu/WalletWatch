const supabase = require('./supabaseClient');
const transactionService = require('./transactionService');

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

    const accounts = await this.getAccountByUserId(convertKeysToCamel(latestIncome));
    const account = accounts.find(acc => acc.id === accountId) || accounts[0];

    if (!account) {
      throw new Error('Account not found');
    }

    const newBalance = latestIncome.transaction_amount + account.balance;

    const { data, error } = await supabase
      .from('money_account')
      .update({ balance: newBalance })
      .eq('account_id', accountId)
      .select();

    if (error) {
      throw new Error(error.message || 'Failed to update balance');
    }

    return data[0];
  }

  async updateExpenseByAccountId(reqExp) {
    if (!reqExp) {
      throw new Error('accountId and latestIncome are required');
    }

    const { data:getAcc, error:errAcc } = await supabase
      .from('money_account').select('balance')
      .eq('account_id', reqExp.accountId);

    if (!getAcc) {
      throw new Error('Account not found');
    }

    const newBalance = getAcc[0].balance - reqExp.transactionAmount;

    const { data, error } = await supabase
      .from('money_account')
      .update({ balance: newBalance })
      .eq('account_id', reqExp.accountId)
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

      if(accData.accountCategory != 'Credit'){
        await transactionService.addNewTransaction({
          transactionAmount : accData.balance,
          transactionType : 'Income',
          transactionCategory : 'Income',
          accountId : data[0].account_id,
          userId : accData.userId,
          transactionName : accData.accountName
        })
      }

      return {
        message : `Account Added Successfully`,
        account : data
      }
  }

  async updateAccount(accData) {
    if(!accData){
      return {message : `Invalid Data`};
    }
    
    const { data:getUser, error: errorUser } = await supabase
      .from('money_account')
      .select('*')
      .eq('account_id', accData.accountId);

    const { data, error } = await supabase
      .from('money_account')
      .update([
        { 
          account_name: accData.accountName, 
          account_category: accData.accountCategory,
          balance: accData.balance
        },
      ])
      .select().eq('account_id', accData.accountId);

      if(error){
        return {
          message : error
        }
      }

      const newBalance = Math.abs(getUser[0].balance - accData.balance)
      if(accData.accountCategory != 'Credit'){
        await transactionService.addNewTransaction({
          transactionAmount : newBalance,
          transactionType : 'Income',
          transactionCategory : 'Income',
          accountId : accData.accountId,
          userId : getUser[0].user_id,
          transactionName : accData.accountName
        })
      }

      return {
        message : `Account Updated Successfully`,
        account : data
      }
  }


}

function convertKeysToCamel(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(convertKeysToCamel);
    }

    const newObj = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      newObj[camelKey] = convertKeysToCamel(obj[key]);
    }
    return newObj;
  }

module.exports = new AccountService();