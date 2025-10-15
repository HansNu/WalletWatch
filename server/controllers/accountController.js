const supabase = require('../service/supabaseClient')

class accountController {

    async getTotalBalanceByUserId(req, res){
        const userId = req.body.userId;
        
        if(!userId){
            return res.status(400).json({
                message: 'userId is required'
            });
        }
        const {data, error} = await supabase.from('money_account').select('balance').eq('user_id', userId);
        if(error){
            return res.status(400).json(error);
        }
        
        let totalBalance = 0;
        
        for(let i = 0; i<data.length; i++){
            totalBalance += data[i].balance;
        }
        
        return res.status(200).json(totalBalance);
    }

}

module.exports = new accountController();