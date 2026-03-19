import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getOrders, createOrder, updateOrder, deleteOrder, seedDemoData } from '../services/api';
import { DATE_FILTERS } from '../widgets/widgetConfig';

const STATUS_COLORS = {
  'Pending':     'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'In progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Completed':   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];

const DEFAULT_PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];

const ORDER_STATUSES = ['Pending', 'In progress', 'Completed'];

const CREATED_BY_OPTIONS = [
  'Mr. Michael Harris',
  'Mr. Ryan Cooper',
  'Ms. Olivia Carter',
  'Mr. Lucas Martin',
];

const REQUIRED = 'Please fill the field';

function OrderModal({ order, onClose, onSave }) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: order || {
      firstName: '', lastName: '', email: '', phone: '',
      address: '', city: '', state: '', postalCode: '', country: '',
      product: '', quantity: 1, unitPrice: 0, status: 'Pending', createdBy: '',
    },
  });

  const [products] = useState(DEFAULT_PRODUCTS);
  const [newProduct, setNewProduct] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Live total amount calculation
  const quantity  = Number(watch('quantity')  || 0);
  const unitPrice = Number(watch('unitPrice') || 0);
  const totalAmount = quantity * unitPrice;

  useEffect(() => {
    if (order) reset(order);
  }, [order]);

  const onSubmit = (data) => {
    data.quantity    = Number(data.quantity);
    data.unitPrice   = Number(data.unitPrice);
    data.totalAmount = data.quantity * data.unitPrice;
    onSave(data);
  };

  const handleAddProduct = () => {
    const trimmed = newProduct.trim();
    if (!trimmed) return;
    if (products.includes(trimmed)) {
      setNewProduct('');
      setShowAddProduct(false);
      return;
    }
    const updated = [...products, trimmed];
    setProducts(updated);
    saveCustomProducts(updated);
    setNewProduct('');
    setShowAddProduct(false);
  };

  const inputCls = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors";
  const labelCls = "block text-xs font-medium text-slate-400 mb-1";
  const errMsg   = "text-red-400 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            {order ? '✏️ Edit Order' : '➕ New Order'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Customer Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name *</label>
                <input {...register('firstName', { required: REQUIRED })} className={inputCls} placeholder="John" />
                {errors.firstName && <p className={errMsg}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input {...register('lastName', { required: REQUIRED })} className={inputCls} placeholder="Doe" />
                {errors.lastName && <p className={errMsg}>{errors.lastName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input {...register('email', { required: REQUIRED })} type="email" className={inputCls} placeholder="john@example.com" />
                {errors.email && <p className={errMsg}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number *</label>
                <input {...register('phone', { required: REQUIRED })} className={inputCls} placeholder="+1 555-0101" />
                {errors.phone && <p className={errMsg}>{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Address</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Street Address *</label>
                <input {...register('address', { required: REQUIRED })} className={inputCls} placeholder="123 Main Street" />
                {errors.address && <p className={errMsg}>{errors.address.message}</p>}
              </div>
              <div>
                <label className={labelCls}>City *</label>
                <input {...register('city', { required: REQUIRED })} className={inputCls} placeholder="New York" />
                {errors.city && <p className={errMsg}>{errors.city.message}</p>}
              </div>
              <div>
                <label className={labelCls}>State / Province *</label>
                <input {...register('state', { required: REQUIRED })} className={inputCls} placeholder="NY" />
                {errors.state && <p className={errMsg}>{errors.state.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Postal Code *</label>
                <input {...register('postalCode', { required: REQUIRED })} className={inputCls} placeholder="10001" />
                {errors.postalCode && <p className={errMsg}>{errors.postalCode.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Country *</label>
                <select {...register('country', { required: REQUIRED })} className={inputCls}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className={errMsg}>{errors.country.message}</p>}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Order Details</p>
            <div className="grid grid-cols-2 gap-4">

              {/* Product dropdown + Add button */}
              <div className="col-span-2">
                <label className={labelCls}>Product *</label>
                <div className="flex gap-2">
                  <select {...register('product', { required: REQUIRED })} className={inputCls}>
                    <option value="">Select a product…</option>
                    {products.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  
                </div>
                {errors.product && <p className={errMsg}>{errors.product.message}</p>}

                {showAddProduct && (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      placeholder="e.g. Fiber Internet 2 Gbps..."
                      className={inputCls}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddProduct(); }
                        if (e.key === 'Escape') { setShowAddProduct(false); setNewProduct(''); }
                      }}
                      autoFocus
                    />
                    <button type="button" onClick={handleAddProduct}
                      className="px-3 py-2 rounded-lg bg-emerald-500 text-slate-900 text-xs font-semibold hover:bg-emerald-400 transition-colors whitespace-nowrap">
                      Save
                    </button>
                    <button type="button" onClick={() => { setShowAddProduct(false); setNewProduct(''); }}
                      className="px-3 py-2 rounded-lg bg-slate-700 text-slate-400 text-xs hover:bg-slate-600 transition-colors">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Quantity *</label>
                <input {...register('quantity', { required: REQUIRED, min: { value: 1, message: REQUIRED } })}
                  type="number" min="1" className={inputCls} />
                {errors.quantity && <p className={errMsg}>{errors.quantity.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Unit Price (₹)*</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input {...register('unitPrice', { required: REQUIRED, min: { value: 0, message: REQUIRED } })}
                    type="number" step="0.01" min="0"
                    className={`${inputCls} pl-7`} placeholder="0.00" />
                </div>
                {errors.unitPrice && <p className={errMsg}>{errors.unitPrice.message}</p>}
              </div>

              {/* Read-only Total Amount */}
              <div className="col-span-2">
                <label className={labelCls}>Total Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input
                    value={totalAmount.toFixed(2)}
                    readOnly
                    className={`${inputCls} pl-7 bg-slate-700/50 text-emerald-400 font-semibold cursor-not-allowed`}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">Auto-calculated: Quantity × Unit price</p>
              </div>

              <div>
                <label className={labelCls}>Status *</label>
                <select {...register('status', { required: REQUIRED })} className={inputCls}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.status && <p className={errMsg}>{errors.status.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Created By *</label>
                <select {...register('createdBy', { required: REQUIRED })} className={inputCls}>
                  <option value="">Select person…</option>
                  {CREATED_BY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.createdBy && <p className={errMsg}>{errors.createdBy.message}</p>}
              </div>

            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-400 text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold transition-colors">
              {order ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Orders({ onOrdersChange }) {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [dateFilter, setDateFilter]       = useState('all');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingOrder, setEditingOrder]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch]               = useState('');
  const [toast, setToast]                 = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders(dateFilter);
      setOrders(res.data || []);
      onOrdersChange?.(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [dateFilter]);

  const handleSave = async (data) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder._id, data);
        showToast('Order updated ✓');
      } else {
        await createOrder(data);
        showToast('Order created ✓');
      }
      setModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving order', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      showToast('Order deleted');
      setDeleteConfirm(null);
      fetchOrders();
    } catch (err) {
      showToast('Failed to delete order', 'error');
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedDemoData();
      showToast(`${res.count} demo orders loaded ✓`);
      fetchOrders();
    } catch (err) {
      showToast('Seed failed', 'error');
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(s) ||
      o.email?.toLowerCase().includes(s) ||
      o.product?.toLowerCase().includes(s) ||
      o.city?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-6 max-w-full">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl fade-in
          ${toast.type === 'error' ? 'bg-red-900 border border-red-700 text-red-200' : 'bg-emerald-900 border border-emerald-700 text-emerald-200'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Customer Orders</h1>
          <p className="text-slate-400 text-sm mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleSeed}
            className="px-4 py-2 text-sm rounded-xl border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
            🌱 Seed Demo
          </button>
          <button onClick={() => { setEditingOrder(null); setModalOpen(true); }}
            className="px-4 py-2 text-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition-colors">
            + New Order
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders…"
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-56"
        />
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors">
          {DATE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p>Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">No orders found</p>
            <p className="text-sm mt-1">Try seeding demo data or create a new order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  {['Customer', 'Email', 'Product', 'Qty', 'Unit Price', 'Total', 'Status', 'Created By', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order._id}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
                    style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">{order.firstName} {order.lastName}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{order.email}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{order.product}</td>
                    <td className="px-4 py-3 text-slate-400 text-center">{order.quantity}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">
                      ₹{(order.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-mono font-semibold whitespace-nowrap">
                      ₹{(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full border text-[11px] font-medium ${STATUS_COLORS[order.status] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{order.createdBy}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingOrder(order); setModalOpen(true); }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">Edit</button>
                        <button onClick={() => setDeleteConfirm(order._id)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 transition-colors">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <OrderModal
          order={editingOrder}
          onClose={() => { setModalOpen(false); setEditingOrder(null); }}
          onSave={handleSave}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 fade-in">
            <p className="text-slate-200 font-semibold text-lg mb-2">Delete Order?</p>
            <p className="text-slate-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-400 text-sm hover:border-slate-500 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
