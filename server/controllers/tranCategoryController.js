const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');
const categoryService = require('../service/tranCategoryService');

class categoryController {
    async getTransactionCategoryByBudgetId(req, res) {
        try {
            const { budgetId } = req.body;

            const user = await categoryService.getTransactionCategoryByBudgetId(budgetId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }
}

module.exports = new categoryController();