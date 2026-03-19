import React, { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import KPIWidget from '../components/KPIWidget';
import ChartWidget from '../components/ChartWidget';
import TableWidget from '../components/TableWidget';
import { getDashboard, saveDashboard } from '../services/api';
import { WIDGET_TYPES, KPI_METRICS, AXIS_OPTIONS, Y_AXIS_OPTIONS, CHART_COLORS } from '../widgets/widgetConfig';

const ResponsiveGridLayout = WidthProvider(Responsive);

let widgetIdCounter = 100;

function WidgetConfigPanel({ widget, onUpdate, onClose, onRemove }) {
  const [local, setLocal] = useState({ ...widget });

  const set = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    onUpdate(local);
    onClose();
  };

  const inputCls = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors";
  const labelCls = "block text-xs font-medium text-slate-400 mb-1 mt-3";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-100">⚙️ Configure Widget</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>
        <div className="p-5">
          <label className={labelCls}>Widget Title</label>
          <input value={local.title || ''} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="My Widget" />

          {local.type === 'kpiCard' && (
            <>
              <label className={labelCls}>Metric</label>
              <select value={local.metric || 'totalRevenue'} onChange={(e) => set('metric', e.target.value)} className={inputCls}>
                {KPI_METRICS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </>
          )}

          {['barChart', 'lineChart', 'areaChart', 'scatterChart', 'pieChart'].includes(local.type) && (
            <>
              <label className={labelCls}>X Axis (Group By)</label>
              <select value={local.xAxis || 'product'} onChange={(e) => set('xAxis', e.target.value)} className={inputCls}>
                {AXIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <label className={labelCls}>Y Axis (Value)</label>
              <select value={local.yAxis || 'totalAmount'} onChange={(e) => set('yAxis', e.target.value)} className={inputCls}>
                {Y_AXIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <label className={labelCls}>Accent Color</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {CHART_COLORS.slice(0, 8).map((c) => (
                  <button key={c} onClick={() => set('color', c)}
                    style={{ background: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${local.color === c ? 'border-white scale-110' : 'border-transparent'}`} />
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={() => { onRemove(widget.id); onClose(); }}
              className="px-3 py-2 rounded-xl bg-red-900/40 text-red-400 text-xs font-medium hover:bg-red-900/70 transition-colors">
              Remove
            </button>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-600 text-slate-400 text-sm hover:border-slate-500 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfigureDashboard({ orders }) {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({});
  const [configWidget, setConfigWidget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load saved layout
  useEffect(() => {
    getDashboard()
      .then((res) => {
        const data = res.data;
        if (data?.widgets?.length) {
          setWidgets(data.widgets);
          // Rebuild layouts from widget positions
          const lg = data.widgets.map((w) => ({
            i: w.id,
            x: w.position?.x ?? 0,
            y: w.position?.y ?? 0,
            w: w.width ?? 4,
            h: w.height ?? 4,
          }));
          setLayouts({ lg });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addWidget = (typeDef) => {
    const id = `w${++widgetIdCounter}`;
    const newWidget = {
      id,
      type: typeDef.type,
      title: typeDef.label,
      metric: 'totalRevenue',
      xAxis: 'product',
      yAxis: 'totalAmount',
      color: CHART_COLORS[0],
      width: typeDef.defaultW,
      height: typeDef.defaultH,
      position: { x: 0, y: Infinity },
    };
    setWidgets((prev) => [...prev, newWidget]);

    setLayouts((prev) => {
      const existing = prev.lg || [];
      return {
        ...prev,
        lg: [...existing, { i: id, x: 0, y: Infinity, w: typeDef.defaultW, h: typeDef.defaultH }],
      };
    });
  };

  const removeWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setLayouts((prev) => ({
      ...prev,
      lg: (prev.lg || []).filter((l) => l.i !== id),
    }));
  };

  const updateWidget = (updated) => {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const onLayoutChange = useCallback((layout, allLayouts) => {
    setLayouts(allLayouts);
    // Sync positions back to widgets
    setWidgets((prev) =>
      prev.map((w) => {
        const l = layout.find((l) => l.i === w.id);
        if (l) return { ...w, width: l.w, height: l.h, position: { x: l.x, y: l.y } };
        return w;
      })
    );
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDashboard({ userId: 'demo', widgets });
      showToast('Dashboard saved ✓');
    } catch {
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

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
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl fade-in
          ${toast.type === 'error' ? 'bg-red-900 border border-red-700 text-red-200' : 'bg-emerald-900 border border-emerald-700 text-emerald-200'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard Builder</h1>
          <p className="text-slate-400 text-sm mt-0.5">Drag, resize, and configure widgets</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 text-sm font-semibold transition-colors flex items-center gap-2">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> Saving…</>
          ) : '💾 Save Layout'}
        </button>
      </div>

      {/* Widget Palette */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Add Widget</p>
        <div className="flex flex-wrap gap-2">
          {WIDGET_TYPES.map((t) => (
            <button key={t.type} onClick={() => addWidget(t)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-slate-700 transition-colors">
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      {widgets.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
          <p className="text-4xl mb-3">🎛️</p>
          <p className="font-medium">No widgets yet</p>
          <p className="text-sm mt-1">Click a widget above to add it to your dashboard</p>
        </div>
      )}

      {/* Grid */}
      {widgets.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-700/30 rounded-2xl p-3 min-h-[400px]">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 8, sm: 4, xs: 4 }}
            rowHeight={60}
            onLayoutChange={onLayoutChange}
            isDraggable
            isResizable
            draggableHandle=".drag-handle"
            margin={[10, 10]}
          >
            {widgets.map((widget) => (
              <div key={widget.id} className="group relative">
                {/* Drag handle + config button */}
                <div className="drag-handle absolute top-0 left-0 right-0 h-8 z-10 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-slate-400 rounded" />
                    <div className="w-4 h-0.5 bg-slate-400 rounded" />
                    <div className="w-4 h-0.5 bg-slate-400 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <button
  onMouseDown={(e) => e.stopPropagation()}
  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setConfigWidget(widget); }}
  className="px-2 py-0.5 text-xs bg-slate-800/90 border border-slate-600 rounded-md text-slate-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
>
  ⚙
</button>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeWidget(widget.id); }}
                      className="px-2 py-0.5 text-xs bg-slate-800/90 border border-red-900/50 rounded-md text-red-400 hover:border-red-400 transition-colors"
                    >✕
                    </button>
                  </div>
                </div>
                {renderWidget(widget)}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}

      {/* Config Panel */}
      {configWidget && (
        <WidgetConfigPanel
          widget={configWidget}
          onUpdate={updateWidget}
          onClose={() => setConfigWidget(null)}
          onRemove={removeWidget}
        />
      )}
    </div>
  );
}
