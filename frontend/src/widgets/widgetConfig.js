export const WIDGET_TYPES = [
  { type: 'kpiCard',     label: 'KPI Card',      icon: '📊', defaultW: 3, defaultH: 2 },
  { type: 'barChart',    label: 'Bar Chart',     icon: '📈', defaultW: 6, defaultH: 4 },
  { type: 'lineChart',   label: 'Line Chart',    icon: '📉', defaultW: 6, defaultH: 4 },
  { type: 'areaChart',   label: 'Area Chart',    icon: '🏔️', defaultW: 6, defaultH: 4 },
  { type: 'scatterChart',label: 'Scatter Chart', icon: '✦',  defaultW: 6, defaultH: 4 },
  { type: 'pieChart',    label: 'Pie Chart',     icon: '🥧', defaultW: 5, defaultH: 4 },
  { type: 'table',       label: 'Data Table',    icon: '📋', defaultW: 8, defaultH: 5 },
];

export const KPI_METRICS = [
  { value: 'totalRevenue',     label: 'Total Revenue',       format: 'currency' },
  { value: 'totalOrders',      label: 'Total Orders',        format: 'number'   },
  { value: 'avgOrderValue',    label: 'Avg Order Value',     format: 'currency' },
  { value: 'pendingOrders',    label: 'Pending Orders',      format: 'number'   },
  { value: 'inProgressOrders', label: 'In Progress Orders',  format: 'number'   },
  { value: 'completedOrders',  label: 'Completed Orders',    format: 'number'   },
  { value: 'totalQuantity',    label: 'Total Quantity Sold', format: 'number'   },
];

export const AXIS_OPTIONS = [
  { value: 'product',   label: 'Product'    },
  { value: 'status',    label: 'Status'     },
  { value: 'createdBy', label: 'Created By' },
  { value: 'country',   label: 'Country'    },
  { value: 'createdAt', label: 'Date'       },
];

export const Y_AXIS_OPTIONS = [
  { value: 'totalAmount', label: 'Total Amount' },
  { value: 'quantity',    label: 'Quantity'     },
  { value: 'unitPrice',   label: 'Unit Price'   },
  { value: 'count',       label: 'Order Count'  },
];

export const CHART_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16',
];

export const DATE_FILTERS = [
  { value: 'all',    label: 'All Time'     },
  { value: 'today',  label: 'Today'        },
  { value: '7days',  label: 'Last 7 Days'  },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
];

// Calculate KPI metrics from orders array
export const calculateKPIs = (orders) => {
  const totalRevenue     = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders      = orders.length;
  const avgOrderValue    = totalOrders ? totalRevenue / totalOrders : 0;
  const pendingOrders    = orders.filter((o) => o.status === 'Pending').length;
  const inProgressOrders = orders.filter((o) => o.status === 'In progress').length;
  const completedOrders  = orders.filter((o) => o.status === 'Completed').length;
  const totalQuantity    = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

  return { totalRevenue, totalOrders, avgOrderValue, pendingOrders, inProgressOrders, completedOrders, totalQuantity };
};

// Aggregate orders data for charts
export const aggregateData = (orders, xAxis, yAxis) => {
  const map = {};

  orders.forEach((order) => {
    let key;
    if (xAxis === 'createdAt') {
      key = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else {
      key = order[xAxis] || 'Unknown';
    }

    if (!map[key]) map[key] = { name: key, totalAmount: 0, quantity: 0, unitPrice: 0, count: 0 };

    map[key].totalAmount += order.totalAmount || 0;
    map[key].quantity    += order.quantity || 0;
    map[key].unitPrice   += order.unitPrice || 0;
    map[key].count       += 1;
  });

  return Object.values(map).sort((a, b) => {
    if (xAxis === 'createdAt') return new Date(a.name) - new Date(b.name);
    return b[yAxis] - a[yAxis];
  });
};

export const formatValue = (value, format) => {
  if (format === 'currency') return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return Number(value).toLocaleString('en-IN');
};
