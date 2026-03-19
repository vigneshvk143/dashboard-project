import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import KPIWidget from '../components/KPIWidget';
import ChartWidget from '../components/ChartWidget';
import TableWidget from '../components/TableWidget';
import { getDashboard } from '../services/api';
import { getOrders } from '../services/api';
import { DATE_FILTERS } from '../widgets/widgetConfig';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({});
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getOrders(dateFilter)])
      .then(([dash, ord]) => {
        const data = dash.data;
        if (data?.widgets?.length) {
          setWidgets(data.widgets);
          const lg = data.widgets.map((w) => ({
            i: w.id,
            x: w.position?.x ?? 0,
            y: w.position?.y ?? 0,
            w: w.width ?? 4,
            h: w.height ?? 4,
          }));
          setLayouts({ lg });
        }
        setOrders(ord.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getOrders(dateFilter).then((res) => setOrders(res.data || []));
  }, [dateFilter]);

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'kpiCard': return <KPIWidget widget={widget} orders={orders} />;
      case 'table': return <TableWidget widget={widget} orders={orders} />;
      default: return <ChartWidget widget={widget} orders={orders} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {orders.length} orders · Live data view
          </p>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
        >
          {DATE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-medium">No widgets configured</p>
          <p className="text-sm mt-1">Go to Dashboard Builder to add widgets</p>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-700/30 rounded-2xl p-3 min-h-[400px]">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 8, sm: 4, xs: 4 }}
            rowHeight={60}
            isDraggable={false}
            isResizable={false}
            margin={[10, 10]}
          >
            {widgets.map((widget) => (
              <div key={widget.id}>
                {renderWidget(widget)}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}
    </div>
  );
}
