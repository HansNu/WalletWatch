const supabase = require('../service/supabaseClient')

class transactionController {

    async getIncomeExpenseByUserIdAndTransactionType(req, res){
        const reqData = req.body;

        if(!reqData) {
            return res.status(400).json({
                message: `Invalid Request`
            });
        }

        const {data, error} = await supabase.from('transaction_history').select('transaction_amount').eq('user_id', reqData.userId).eq('transaction_type', reqData.transactionType);

        if(error){
            return res.status(400).json(error);
        }

        let transactionAmt = 0;
        
        for(let i = 0; i<data.length; i++){
            transactionAmt += data[i].transaction_amount;
        }
        
        return res.status(200).json(transactionAmt);
    }

    async getLatestTransactionRecord(req, res){
        const record = req.body;

        if(!record) {
            return res.status(400).json({
                message: `Invalid Request`
            });
        }

        const {data, error} = await supabase.from('transaction_history').select('*').eq('user_id', record.userId);
        if(error){
            return res.status(400).json(error);
        }

        return res.status(200).json(data);
    }
}

module.exports = new transactionController();