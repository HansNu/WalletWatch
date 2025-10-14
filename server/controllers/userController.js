const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient')

class userController {
    async getUserByUserId(req, res) {
        const userId = req.body.userId;

        if(!userId){
            return res.status(400).json({
                message: 'userId is required'
            });
        }

        const { data, error } =  await supabase.from('users').select('*').eq('user_id', userId);

        if(error){
            return res.status(400).json(error);
        } else {
            return res.status(200).json(data);
        }
    }
}

module.exports = new userController();