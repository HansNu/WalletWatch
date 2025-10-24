const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');

class categoryService {
    async getTransactionCategoryByBudgetId(budgetid) {
        if (!budgetid) {
            throw new Error('budgetid is required');
        }

        const { data, error } = await supabase
            .from('transaction_category')
            .select('*')
            .eq('budget_id', budgetid)

        if (error) {
            if (error.code === 'PGRST116') {
                return null; 
            }
            throw new Error(error.message || 'Failed to fetch user');
        }

        return data;
    }
}

module.exports = new categoryService();