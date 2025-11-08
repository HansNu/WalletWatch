// service/transactionService.js
const supabase = require('./supabaseClient');
const budgetService = require('./budgetService');

class TransactionService {
  async getIncomeExpenseByUserIdAndTransactionType(reqInEx) {

    const { data, error } = await supabase
      .from('transaction_history')
      .select('transaction_amount')
      .eq('user_id', reqInEx.userId)
      .eq('transaction_type', reqInEx.transactionType)
      .gte('created_dt', reqInEx.startDt)
      .lte('created_dt', reqInEx.endDt);;

    if (error) {
      throw new Error(error.message || 'Failed to fetch transactions');
    }

    const total = data.reduce((sum, t) => sum + (t.transaction_amount || 0), 0);
    return total;
  }

  async getLatestTransactionRecord(userId) {
    if (!userId) {
      throw new Error('userId is required');
    }

    const { data, error } = await supabase
      .from('transaction_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_dt', { ascending: false });

    if (error) {
      throw new Error(error.message || 'Failed to fetch latest transactions');
    }

    return data;
  }

  async getLatestTransactionRecordByCategory(reqHistory) {
    if (!reqHistory) {
      throw new Error('userId is required');
    }

    const { data, error } = await supabase
      .from('transaction_history')
      .select('*')
      .eq('user_id', reqHistory.userId).eq('transaction_category', reqHistory.categoryName)
      .order('created_dt', { ascending: false });

    if (error) {
      throw new Error(error.message || 'Failed to fetch latest transactions');
    }

    return data;
  }

  async getLatestIncome(accountId) {
    if (!accountId) {
      throw new Error('accountId is required');
    }

    const { data, error } = await supabase
      .from('transaction_history')
      .select('transaction_amount, user_id')
      .eq('transaction_type', 'Income')
      .eq('account_id', accountId)
      .order('created_dt', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no row found, Supabase returns error with code 'PGRST116'
      if (error.code === 'PGRST116') {
        return null; // No income found
      }
      throw new Error(error.message || 'Failed to fetch latest income');
    }

    return data;
  }

  async getTransactionBasedOnUserIdAndDateRange(reqObj) {
    if (!reqObj) {
      throw new Error('reqObj is required');
    }

    const budgetData = await budgetService.getBudgetByUserId(reqObj.userId);

    const { data, error } = await supabase
      .from('transaction_history')
      .select('*')
      .eq('user_id', reqObj.userId).neq('transaction_type', 'Income')
      .gte('created_dt', budgetData.start_dt)
      .lte('created_dt', budgetData.end_dt);

    if (error) return { message: error };

    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].transaction_amount
    }

    return total;
  }

  async addNewTransaction(transactionData) {
    const {
      transactionAmount,
      transactionType,
      transactionCategory,
      accountId,
      userId,
      transactionName
    } = transactionData;

    if (!userId || !transactionAmount || !transactionType) {
      throw new Error('userId, transactionAmount, and transactionType are required');
    }

    // Auto-set category for Income
    let finalCategory = transactionCategory;
    if (transactionType === 'Income') {
      finalCategory = 'Income';
    }

    const { data, error } = await supabase
      .from('transaction_history')
      .insert([
        {
          transaction_amount: parseFloat(transactionAmount),
          transaction_type: transactionType,
          transaction_category: finalCategory || null,
          account_id: accountId || null,
          user_id: userId,
          transaction_name: transactionName || null,
        }
      ])
      .select();

    if (error) {
      throw new Error(error.message || 'Failed to create transaction');
    }

    return data[0];
  }

}

module.exports = new TransactionService();