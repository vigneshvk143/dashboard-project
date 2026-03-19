require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dashboard_db';

mongoose.connect(MONGO_URI)
  .then(() => { console.log('✅ MongoDB connected'); app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`)); })
  .catch((err) => { console.error('MongoDB error:', err); app.listen(PORT, () => console.log(`🚀 Server on port ${PORT} (no DB)`)); });

module.exports = app;
