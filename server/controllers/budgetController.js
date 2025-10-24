const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');
const budgetService = require('../service/budgetService');

class budgetController {
    async getBudgetByBudgetId(req, res) {
        try {
            const { budgetId } = req.body;

            if (!budgetId) {
                return res.status(400).json({
                    message: 'budgetId is required'
                });
            }

            const user = await budgetService.getBudgetByBudgetId(budgetId);

            if (!user) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message});
        }
    }

    async getBudgetByUserId(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    message: 'userId is required'
                });
            }

            const user = await budgetService.getBudgetByUserId(userId);

            if (!user) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message});
        }
    }

    async addNewBudget(req, res) {
        try {
            const reqBudget = req.body;
            const result = await budgetService.addNewBudget(reqBudget);

            res.status(201).json(result);

        } catch (error) {
            const message = error.message;

            res.status(status).json({
                error: message,
            });
        }
    }

}

module.exports = new budgetController();