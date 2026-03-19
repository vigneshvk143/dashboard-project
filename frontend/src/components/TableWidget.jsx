import React, { useState } from 'react';

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function TableWidget({ widget, orders }) {
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(orders.length / pageSize);
  const visible = orders.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/80 rounded-xl border border-slate-700/50 p-3">
      {widget.title && (
        <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">{widget.title}</p>
      )}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 pr-3 font-medium">Customer</th>
              <th className="text-left py-2 pr-3 font-medium">Product</th>
              <th className="text-left py-2 pr-3 font-medium">Qty</th>
              <th className="text-right py-2 pr-3 font-medium">Amount</th>
              <th className="text-left py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order._id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="py-2 pr-3 text-slate-300">
                  {order.firstName} {order.lastName}
                </td>
                <td className="py-2 pr-3 text-slate-400 truncate max-w-[100px]">{order.product}</td>
                <td className="py-2 pr-3 text-slate-400">{order.quantity}</td>
                <td className="py-2 pr-3 text-right text-emerald-400 font-mono font-medium">
                  ${(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
          <span className="text-slate-500 text-xs">{orders.length} total</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              ←
            </button>
            <span className="px-2 py-1 text-xs text-slate-400">{page + 1}/{totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
