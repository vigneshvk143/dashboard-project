const express = require('express');
const router = express.Router();
const DashboardLayout = require('../models/DashboardLayout');

const DEFAULT_WIDGETS = [
  { id: 'w1', type: 'kpiCard',   title: 'Total Revenue',      metric: 'totalRevenue', width: 3, height: 2, position: { x: 0, y: 0 } },
  { id: 'w2', type: 'kpiCard',   title: 'Total Orders',       metric: 'totalOrders',  width: 3, height: 2, position: { x: 3, y: 0 } },
  { id: 'w3', type: 'kpiCard',   title: 'Avg Order Value',    metric: 'avgOrderValue',width: 3, height: 2, position: { x: 6, y: 0 } },
  { id: 'w4', type: 'kpiCard',   title: 'Pending Orders',     metric: 'pendingOrders',width: 3, height: 2, position: { x: 9, y: 0 } },
  { id: 'w5', type: 'barChart',  title: 'Revenue by Product', xAxis: 'product',  yAxis: 'totalAmount', width: 6, height: 4, position: { x: 0, y: 2 } },
  { id: 'w6', type: 'pieChart',  title: 'Orders by Status',   xAxis: 'status',   yAxis: 'count',       width: 6, height: 4, position: { x: 6, y: 2 } },
  { id: 'w7', type: 'lineChart', title: 'Revenue Over Time',  xAxis: 'createdAt',yAxis: 'totalAmount', width: 12, height: 4, position: { x: 0, y: 6 } },
];

// GET layout
router.get('/', async (req, res) => {
  try {
    const { userId = 'demo' } = req.query;
    const layout = await DashboardLayout.findOne({ userId });
    if (!layout) {
      return res.json({ success: true, data: { userId, name: 'My Dashboard', widgets: DEFAULT_WIDGETS } });
    }
    res.json({ success: true, data: layout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST save layout
router.post('/', async (req, res) => {
  try {
    const { userId = 'demo', widgets = [], name = 'My Dashboard' } = req.body;
    const layout = await DashboardLayout.findOneAndUpdate(
      { userId },
      { userId, widgets, name },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: layout, message: 'Dashboard saved!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
