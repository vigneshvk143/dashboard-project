const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/CustomerOrder');

const seedOrders = [
  { firstName: 'Alice',   lastName: 'Johnson',  email: 'alice@example.com',   phone: '555-0101', address: '123 Main St',       city: 'New York',      state: 'NY', postalCode: '10001', country: 'United States', product: 'Fiber Internet 300 Mbps',    quantity: 2, unitPrice: 49.99,  status: 'Completed',   createdBy: 'Mr. Michael Harris', createdAt: new Date('2026-01-15') },
  { firstName: 'Bob',     lastName: 'Smith',    email: 'bob@example.com',     phone: '555-0102', address: '456 Oak Ave',        city: 'Los Angeles',   state: 'CA', postalCode: '90001', country: 'Canada',        product: '5G Unlimited Mobile Plan',   quantity: 5, unitPrice: 35.00,  status: 'In progress', createdBy: 'Mr. Ryan Cooper',    createdAt: new Date('2026-01-18') },
  { firstName: 'Carol',   lastName: 'White',    email: 'carol@example.com',   phone: '555-0103', address: '789 Pine Rd',        city: 'Chicago',       state: 'IL', postalCode: '60601', country: 'Australia',     product: 'Fiber Internet 1 Gbps',      quantity: 1, unitPrice: 89.99,  status: 'Pending',     createdBy: 'Ms. Olivia Carter',  createdAt: new Date('2026-01-20') },
  { firstName: 'David',   lastName: 'Brown',    email: 'david@example.com',   phone: '555-0104', address: '321 Elm St',         city: 'Houston',       state: 'TX', postalCode: '77001', country: 'Singapore',     product: 'Business Internet 500 Mbps', quantity: 3, unitPrice: 120.00, status: 'Completed',   createdBy: 'Mr. Lucas Martin',   createdAt: new Date('2026-02-22') },
  { firstName: 'Eva',     lastName: 'Davis',    email: 'eva@example.com',     phone: '555-0105', address: '654 Maple Dr',       city: 'Phoenix',       state: 'AZ', postalCode: '85001', country: 'Hong Kong',     product: 'VoIP Corporate Package',     quantity: 2, unitPrice: 75.00,  status: 'Pending',     createdBy: 'Mr. Michael Harris', createdAt: new Date('2026-01-25') },
  { firstName: 'Frank',   lastName: 'Miller',   email: 'frank@example.com',   phone: '555-0106', address: '987 Cedar Ln',       city: 'Philadelphia',  state: 'PA', postalCode: '19101', country: 'United States', product: 'Fiber Internet 300 Mbps',    quantity: 4, unitPrice: 49.99,  status: 'Completed',   createdBy: 'Mr. Ryan Cooper',    createdAt: new Date('2026-02-01') },
  { firstName: 'Grace',   lastName: 'Wilson',   email: 'grace@example.com',   phone: '555-0107', address: '147 Birch Blvd',     city: 'San Antonio',   state: 'TX', postalCode: '78201', country: 'Canada',        product: '5G Unlimited Mobile Plan',   quantity: 6, unitPrice: 35.00,  status: 'In progress', createdBy: 'Ms. Olivia Carter',  createdAt: new Date('2026-03-05') },
  { firstName: 'Henry',   lastName: 'Moore',    email: 'henry@example.com',   phone: '555-0108', address: '258 Walnut Ave',     city: 'San Diego',     state: 'CA', postalCode: '92101', country: 'Australia',     product: 'Fiber Internet 1 Gbps',      quantity: 2, unitPrice: 89.99,  status: 'Completed',   createdBy: 'Mr. Lucas Martin',   createdAt: new Date('2026-02-08') },
  { firstName: 'Iris',    lastName: 'Taylor',   email: 'iris@example.com',    phone: '555-0109', address: '369 Spruce St',      city: 'Dallas',        state: 'TX', postalCode: '75201', country: 'Singapore',     product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 120.00, status: 'In progress', createdBy: 'Mr. Michael Harris', createdAt: new Date('2026-02-10') },
  { firstName: 'Jack',    lastName: 'Anderson', email: 'jack@example.com',    phone: '555-0110', address: '741 Hickory Rd',     city: 'San Jose',      state: 'CA', postalCode: '95101', country: 'Hong Kong',     product: 'VoIP Corporate Package',     quantity: 3, unitPrice: 75.00,  status: 'Pending',     createdBy: 'Mr. Ryan Cooper',    createdAt: new Date('2026-02-12') },
  { firstName: 'Karen',   lastName: 'Thomas',   email: 'karen@example.com',   phone: '555-0111', address: '852 Poplar Dr',      city: 'Austin',        state: 'TX', postalCode: '78701', country: 'United States', product: 'Fiber Internet 300 Mbps',    quantity: 2, unitPrice: 49.99,  status: 'Completed',   createdBy: 'Ms. Olivia Carter',  createdAt: new Date('2026-02-15') },
  { firstName: 'Leo',     lastName: 'Jackson',  email: 'leo@example.com',     phone: '555-0112', address: '963 Ash Ln',         city: 'Jacksonville',  state: 'FL', postalCode: '32099', country: 'Canada',        product: '5G Unlimited Mobile Plan',   quantity: 4, unitPrice: 35.00,  status: 'In progress', createdBy: 'Mr. Lucas Martin',   createdAt: new Date('2026-02-18') },
  { firstName: 'Mia',     lastName: 'Harris',   email: 'mia@example.com',     phone: '555-0113', address: '159 Magnolia Blvd',  city: 'San Francisco', state: 'CA', postalCode: '94101', country: 'Australia',     product: 'Fiber Internet 1 Gbps',      quantity: 1, unitPrice: 89.99,  status: 'Pending',     createdBy: 'Mr. Michael Harris', createdAt: new Date('2026-02-20') },
  { firstName: 'Noah',    lastName: 'Martin',   email: 'noah@example.com',    phone: '555-0114', address: '357 Willow Way',     city: 'Columbus',      state: 'OH', postalCode: '43201', country: 'Singapore',     product: 'Business Internet 500 Mbps', quantity: 2, unitPrice: 120.00, status: 'Completed',   createdBy: 'Mr. Ryan Cooper',    createdAt: new Date('2026-02-22') },
  { firstName: 'Olivia',  lastName: 'Garcia',   email: 'olivia@example.com',  phone: '555-0115', address: '468 Redwood Rd',     city: 'Charlotte',     state: 'NC', postalCode: '28201', country: 'Hong Kong',     product: 'VoIP Corporate Package',     quantity: 5, unitPrice: 75.00,  status: 'In progress', createdBy: 'Ms. Olivia Carter',  createdAt: new Date('2026-03-01') },
];

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { dateFilter } = req.query;
    let query = {};
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      let startDate;
      if (dateFilter === 'today')  startDate = new Date(now.setHours(0,0,0,0));
      if (dateFilter === '7days')  startDate = new Date(Date.now() - 7*24*60*60*1000);
      if (dateFilter === '30days') startDate = new Date(Date.now() - 30*24*60*60*1000);
      if (dateFilter === '90days') startDate = new Date(Date.now() - 90*24*60*60*1000);
      if (startDate) query.createdAt = { $gte: startDate };
    }
    const orders = await CustomerOrder.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    data.totalAmount = Number(data.quantity) * Number(data.unitPrice);
    const order = new CustomerOrder(data);
    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.quantity && data.unitPrice) {
      data.totalAmount = Number(data.quantity) * Number(data.unitPrice);
    }
    const order = await CustomerOrder.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST seed demo data
router.post('/seed/demo', async (req, res) => {
  try {
    await CustomerOrder.deleteMany({});
    const orders = seedOrders.map((o) => ({ ...o, totalAmount: o.quantity * o.unitPrice }));
    const created = await CustomerOrder.insertMany(orders);
    res.json({ success: true, message: `${created.length} demo orders created`, count: created.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
