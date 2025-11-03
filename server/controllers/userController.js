const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');
const userService = require('../service/userService');

class userController {
    async getUserByUserId(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    message: 'userId is required'
                });
            }

            const user = await userService.getUserByUserId(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }

    async updateUserData(req, res) {
        try {
            const reqUser = req.body;

            if (!reqUser) {
                return res.status(400).json({
                    message: 'reqUser is required'
                });
            }

            const user = await userService.updateUserData(reqUser);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }


}

module.exports = new userController();