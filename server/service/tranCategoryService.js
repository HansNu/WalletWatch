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

    async addNewTransactionCategory(catObj) {
        if (!catObj) {
            throw new Error('Invalid request: catObj is required');
        }

        const { data, error } = await supabase
            .from('transaction_category')
            .insert({
                category_name: catObj.categoryName,
                budget_allocation: catObj.budgetAllocation,
                budget_id: catObj.budgetId
            })
            .select('*');

        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        return data;
    }

    async updateTransactionCategory(catObj) {
        if (!catObj) {
            throw new Error('Invalid request: catObj is required');
        }

        const { data, error } = await supabase
            .from('transaction_category')
            .update({
                category_name: catObj.categoryName,
                budget_allocation: catObj.categoryAllocation,
            }).select('*')
            .eq('transaction_category_id', catObj.categoryId);

        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        return data;
    }

    async deleteTransactionCategory(catObj) {
        if (!catObj) {
            throw new Error('Invalid request: catObj is required');
        }

        const { data, error } = await supabase
            .from('transaction_category')
            .delete()
            .eq('transaction_category_id', catObj.categoryId);

        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        return {message : `Category deleted successfully`};
    }
}

module.exports = new categoryService();