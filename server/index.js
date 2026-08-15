const path = require('path');
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

// The client is now served by this same server (see express.static below),
// so in production requests are same-origin and CORS isn't actually needed
// there. Keep it enabled for local dev, where the Vite dev server (5173)
// calls this server on a different port.
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Simple health check
app.get('/api/message', (req, res) => {
  res.json({ message: 'Backend is alive' });
});

// Mount all your routes under /api
app.use('/api', userRoutes);
app.use('/api', accountRoutes);
app.use('/api', transactionRoutes);
app.use('/api', budgetRoutes);
app.use('/api', categoryRoutes);

// Serve the built React app. `vite build` outputs to client/dist (the
// Vite default) -- not client/build (that's the create-react-app default).
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback: any non-API route falls through to index.html so
// react-router can handle client-side routing.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;