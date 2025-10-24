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

    async addNewTransactionCategory(req, res) {
        try {
            const newCat = await categoryService.addNewTransactionCategory(req.body);
            return res.status(201).json(newCat); 
        } catch (err) {
            return res.status(400).json({ message: err });
        }
    }

    async updateTransactionCategory(req, res) {
        try {
            const newCat = await categoryService.updateTransactionCategory(req.body);
            return res.status(201).json(newCat); 
        } catch (err) {
            return res.status(400).json({ message: err });
        }
    }
    
    async deleteTransactionCategory(req, res) {
        try {
            const newCat = await categoryService.deleteTransactionCategory(req.body);
            return res.status(201).json(newCat); 
        } catch (err) {
            return res.status(400).json({ message: err });
        }
    }
}

module.exports = new categoryController();