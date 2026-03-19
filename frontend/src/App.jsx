import React, { useState, useEffect } from 'react';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import ConfigureDashboard from './pages/ConfigureDashboard';
import Login from './pages/Login';
import { getOrders } from './services/api';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'builder',   label: 'Builder',   icon: '🎛️' },
  { id: 'orders',    label: 'Orders',    icon: '📦' },
];

export default function App() {
  const [user, setUser]           = useState(() => localStorage.getItem('dashUser') || null);
  const [page, setPage]           = useState('dashboard');
  const [orders, setOrders]       = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getOrders().then((res) => setOrders(res.data || [])).catch(() => {});
    }
  }, [user]);

  const handleLogin = (username) => {
    localStorage.setItem('dashUser', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashUser');
    setUser(null);
    setPage('dashboard');
  };

  const handleOrdersChange = (newOrders) => setOrders(newOrders);

  // Avatar letter = first letter of username, uppercase
  const avatarLetter = user ? user.charAt(0).toUpperCase() : '?';

  // Show login page if not logged in
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 sm:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed sm:static inset-y-0 left-0 z-40
        w-56 bg-slate-900 border-r border-slate-700/50
        flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm">◈</div>
            <div>
              <p className="text-slate-100 font-semibold text-sm leading-none">DataDash</p>
              <p className="text-slate-500 text-xs mt-0.5">Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { setPage(n.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${page === n.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        {/* User Profile + Logout */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white">
                {avatarLetter}
              </div>
              <div>
                <p className="text-slate-300 text-xs font-medium capitalize">{user}</p>
                <p className="text-slate-600 text-xs">{orders.length} orders</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-500 hover:text-red-400 transition-colors text-sm px-1"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 sm:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-700/50">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-200 text-xl">☰</button>
          <p className="text-slate-200 font-semibold text-sm">{NAV.find((n) => n.id === page)?.label}</p>
          <div className="w-7" />
        </div>

        <div className="fade-in">
          {page === 'dashboard' && <Dashboard />}
          {page === 'builder'   && <ConfigureDashboard orders={orders} />}
          {page === 'orders'    && <Orders onOrdersChange={handleOrdersChange} />}
        </div>
      </main>
    </div>
  );
}
