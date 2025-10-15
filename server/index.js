const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./service/supabaseClient');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();
const port = 4200;
const baseUrl = '/api';

app.use(cors());
app.use(express.json());

app.get(baseUrl + '/message', (req, res) => {
    res.json({message : 'Hello from the Express Server'});
});

app.use(baseUrl, userRoutes);   
app.use(baseUrl, accountRoutes);
app.use(baseUrl, transactionRoutes);

app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;