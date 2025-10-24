const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');

class budgetService {
    async getBudgetByBudgetId(budgetId) {
        if (!budgetId) {
            throw new Error('budgetId is required');
        }

        const { data, error } = await supabase
            .from('budget')
            .select('*')
            .eq('budget_id', budgetId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message || 'Failed to fetch user');
        }

        return data;
    }

    async getBudgetByUserId(userId) {
        if (!userId) {
            throw new Error('budgetId is required');
        }

        const { data, error } = await supabase
            .from('budget')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message || 'Failed to fetch user');
        }

        return data;
    }

    async addNewBudget(reqBudget) {
        try {
            const { amount, period, startDate, endDate, userId } = reqBudget;

            // Validation
            if (!amount || amount <= 0) {
                throw { status: 400, message: 'Amount must be greater than 0' };
            }

            if (!period) {
                throw { status: 400, message: 'Period is required' };
            }

            if (!userId) {
                throw { status: 400, message: 'UserId is required' };
            }

            // Calculate dates if not provided
            let finalStartDate = startDate;
            let finalEndDate = endDate;

            if (!startDate || !endDate) {
                const dates = calculateDates(period, startDate);
                finalStartDate = dates.startDate;
                finalEndDate = dates.endDate;
            }

            // Validate categories
            // for (const category of categories) {
            //     if (!category.name || !category.allocation) {
            //         throw {
            //             status: 400,
            //             message: 'Each category must have a name and allocation'
            //         };
            //     }
            // }

            // // Calculate total allocation
            // const totalAllocation = categories.reduce((sum, cat) => sum + parseFloat(cat.allocation), 0);

            // if (totalAllocation > amount) {
            //     throw {
            //         status: 400,
            //         message: `Total allocation (${totalAllocation}) cannot exceed budget amount (${amount})`
            //     };
            // }

            // Insert budget
            const { data: budgetData, error: budgetError } = await supabase
                .from('budget')
                .insert({
                    budget_amt: parseFloat(amount),
                    budget_period: period.toLowerCase(),
                    start_dt: finalStartDate,
                    end_dt: finalEndDate,
                    user_id: userId
                })
                .select()
                .single();

            if (budgetError) {
                throw budgetError;
            }

            //  // Insert categories
            // const categoriesWithBudgetId = categories.map(cat => ({
            //     budget_id: budgetData.id,
            //     category_name: cat.name,
            //     budget_allocation: parseFloat(cat.allocation),
            // }));

            // const { data: categoriesData, error: categoriesError } = await supabase
            //     .from('transaction_category')
            //     .insert(categoriesWithBudgetId)
            //     .select();

            // if (categoriesError) {
            //     // Rollback: delete the budget if categories insertion fails
            //     await supabase.from('budgets').delete().eq('id', budgetData.id);
            //     throw categoriesError;
            // }

            return {
                success: true,
                message: 'Budget created successfully',
                data: {
                    budget: budgetData,
                }
            };

        } catch (error) {
            console.error('Error in addNewBudget:', error);
            throw error;
        }
    }

}

function calculateDates(period, startDate) {
    const start = startDate ? new Date(startDate) : new Date();
    let end = new Date(start);

    switch (period.toLowerCase()) {
        case 'daily':
            // Same day
            end = new Date(start);
            break;
        case 'weekly':
            // Today + 7 days
            end.setDate(start.getDate() + 7);
            break;
        case 'monthly':
            // Same date next month
            end.setMonth(start.getMonth() + 1);
            break;
        default:
            throw new Error('Invalid period. Must be daily, weekly, or monthly');
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
    };
}


module.exports = new budgetService();