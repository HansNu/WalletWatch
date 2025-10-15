const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL); // 👈 ADD THIS
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY); // 👈 ADD THIS

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) throw new Error('SUPABASE_URL is missing!');
if (!supabaseKey) throw new Error('SUPABASE_KEY is missing!');

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client initialized:', supabase);

module.exports = supabase;