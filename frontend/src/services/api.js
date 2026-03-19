import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Orders ────────────────────────────────────────────────────────────────

export const getOrders = (dateFilter = 'all') =>
  api.get('/orders', { params: { dateFilter } }).then((r) => r.data);

export const createOrder = (data) => api.post('/orders', data).then((r) => r.data);

export const updateOrder = (id, data) => api.put(`/orders/${id}`, data).then((r) => r.data);

export const deleteOrder = (id) => api.delete(`/orders/${id}`).then((r) => r.data);

export const seedDemoData = () => api.post('/orders/seed/demo').then((r) => r.data);

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const getDashboard = (userId = 'demo') =>
  api.get('/dashboard', { params: { userId } }).then((r) => r.data);

export const saveDashboard = (data) => api.post('/dashboard', data).then((r) => r.data);

export default api;
