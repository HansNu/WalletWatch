const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./service/supabaseClient');

const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/tranCategoryRoutes');

dotenv.config();

const app = express();

// Allow requests from your live Netlify site
app.use(cors({
  origin: ['https://walletwatches.netlify.app', 'http://localhost:5173'], // allow both prod + dev
  credentials: true
}));

app.use(express.json());

// Simple health check
app.get('/api/message', (req, res) => {
  res.json({ message: 'Backend is alive on Fly.io!' });
});

// Mount all your routes under /api
app.use('/api', userRoutes);
app.use('/api', accountRoutes);
app.use('/api', transactionRoutes);
app.use('/api', budgetRoutes);
app.use('/api', categoryRoutes);

// CRITICAL: Use process.env.PORT (Fly.io sets this to 8080)
// and bind to 0.0.0.0 (not localhost!)
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on https://walletwatch.fly.dev (port ${PORT})`);
});

module.exports = app;