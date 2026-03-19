import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { aggregateData, CHART_COLORS, formatValue } from '../widgets/widgetConfig';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
  <p key={i} style={{ color: p.color }} className="font-semibold">
    {typeof p.value === 'number' && p.value > 100
      ? `₹${p.value.toLocaleString('en-IN')}`
      : p.value?.toLocaleString('en-IN')}
  </p>
))}
    </div>
  );
};

export default function ChartWidget({ widget, orders }) {
  const { type, xAxis = 'product', yAxis = 'totalAmount', color = '#10b981', title } = widget;
  const data = aggregateData(orders, xAxis, yAxis);
  const strokeColor = color || '#10b981';

  const axisStyle = { fill: '#94a3b8', fontSize: 11, fontFamily: 'DM Sans' };
  const gridStyle = { stroke: '#1e293b', strokeDasharray: '4 4' };

  const commonProps = {
    data,
    margin: { top: 5, right: 10, left: -10, bottom: 5 },
  };

  const renderChart = () => {
    switch (type) {
      case 'barChart':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid {...gridStyle} />
            <XAxis
  dataKey="name"
  interval={0}
  height={50}
  tick={(props) => {
    const { x, y, payload } = props;
    const words = payload.value.split(' ');
    const lines = [];
    let current = '';
    words.forEach((word) => {
      if ((current + ' ' + word).trim().length > 12) {
        lines.push(current.trim());
        current = word;
      } else {
        current = (current + ' ' + word).trim();
      }
    });
    if (current) lines.push(current.trim());
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={0}
            dy={12 + i * 12}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={10}
            fontFamily="DM Sans"
          >
            {line}
          </text>
        ))}
      </g>
    );
  }}
/>
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yAxis} fill={strokeColor} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'lineChart':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={yAxis} stroke={strokeColor} strokeWidth={2} dot={{ r: 4, fill: strokeColor }} />
          </LineChart>
        );

      case 'areaChart':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={yAxis} stroke={strokeColor} fill="url(#areaGrad)" strokeWidth={2} />
          </AreaChart>
        );

      case 'scatterChart':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="count" name="Orders" tick={axisStyle} />
            <YAxis dataKey={yAxis} name={yAxis} tick={axisStyle} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter data={data} fill={strokeColor} />
          </ScatterChart>
        );

      case 'pieChart': {
        const RADIAN = Math.PI / 180;
        const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const r = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + r * Math.cos(-midAngle * RADIAN);
          const y = cy + r * Math.sin(-midAngle * RADIAN);
          return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          ) : null;
        };
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius="80%"
              dataKey={yAxis}
              nameKey="name"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
          </PieChart>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/80 rounded-xl border border-slate-700/50 p-3">
      {title && (
        <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 px-1">{title}</p>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
