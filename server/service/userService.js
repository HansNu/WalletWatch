const { options } = require('../routes/userRoutes');
const supabase = require('../service/supabaseClient');

class userService {
    async getUserByUserId(userId) {
        if (!userId) {
            throw new Error('userId is required');
        }

        const { data, error } = await supabase
            .from('users')
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

    async updateUserData(reqUser) {
        if(!reqUser){
            throw new Error('Invalid request');
        }

        const {data, error} = await supabase.from('users').update({
                                    first_name : reqUser.firstName,
                                    last_name : reqUser.lastName,
                                })
                                .eq('user_id', reqUser.userId)
                                .select('*');
        if(error){
            throw new Error(error.message);
        }

        return data;
    }
}

module.exports = new userService();