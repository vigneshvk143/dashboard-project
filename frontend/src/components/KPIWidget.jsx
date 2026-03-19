import React from 'react';
import { calculateKPIs, KPI_METRICS, formatValue } from '../widgets/widgetConfig';

const TREND_ICONS = {
  totalRevenue:     '💰',
  totalOrders:      '📦',
  avgOrderValue:    '📊',
  pendingOrders:    '⏳',
  inProgressOrders: '🔄',
  completedOrders:  '✅',
  totalQuantity:    '🛒',
};

const colors = {
  totalRevenue:     'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  totalOrders:      'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  avgOrderValue:    'from-violet-500/20 to-violet-600/10 border-violet-500/30',
  pendingOrders:    'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  inProgressOrders: 'from-sky-500/20 to-sky-600/10 border-sky-500/30',
  completedOrders:  'from-teal-500/20 to-teal-600/10 border-teal-500/30',
  totalQuantity:    'from-pink-500/20 to-pink-600/10 border-pink-500/30',
};

const textColors = {
  totalRevenue:     'text-emerald-400',
  totalOrders:      'text-blue-400',
  avgOrderValue:    'text-violet-400',
  pendingOrders:    'text-amber-400',
  inProgressOrders: 'text-sky-400',
  completedOrders:  'text-teal-400',
  totalQuantity:    'text-pink-400',
};

export default function KPIWidget({ widget, orders }) {
  const kpis    = calculateKPIs(orders);
  const metric  = widget.metric || 'totalRevenue';
  const value   = kpis[metric] ?? 0;

  const metaInfo  = KPI_METRICS.find((m) => m.value === metric);
  const formatted = formatValue(value, metaInfo?.format || 'number');
  const icon      = TREND_ICONS[metric] || '📊';

  return (
    <div className={`h-full w-full bg-gradient-to-br ${colors[metric] || colors.totalRevenue} border rounded-xl p-4 flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            {widget.title || metaInfo?.label || 'Metric'}
          </p>
          <p className={`text-2xl font-bold ${textColors[metric] || 'text-emerald-400'} leading-none`}>
            {formatted}
          </p>
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      <div className="mt-2">
        <div className="h-1 bg-slate-700 rounded-full">
          <div
            className={`h-1 rounded-full ${textColors[metric]?.replace('text-', 'bg-') || 'bg-emerald-400'}`}
            style={{ width: `${Math.min((value / (value * 1.2 + 1)) * 100, 85)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
