const supabase = require('../service/supabaseClient')

class userController {
    async getUserByUserId(req, res) {
        const userId = req.body.userId;
        const { data, error } =  await supabase.from('user').select('*').eq('user_id', userId);

        if(error){
            return res.status(400).json(error);
        } else {
            return res.status(200).json(data);
        }
    }
}

module.exports = new userController();