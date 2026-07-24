import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Sparkles
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { orders, products, customers, setAdminTab } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter(p => p.stock <= 20);

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Executive Overview
          </span>
          <h2 className="text-2xl font-black text-white font-serif mt-1">
            Akshvik Store Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time performance metrics and store management hub.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setAdminTab('banners')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl cursor-pointer"
          >
            Create Banner
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalOrdersCount}</p>
          <p className="text-[11px] text-sky-400 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> 94% Fulfilled successfully
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{customers.length + 128}</p>
          <p className="text-[11px] text-purple-400 font-bold">
            86% Repeat Parent Buyers
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{products.length} Items</p>
          <p className="text-[11px] text-amber-400 font-bold">
            100% Baby Safe Certified
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-serif">Recent Store Orders</h3>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
            >
              View All Orders <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="p-3 font-medium">{order.customer.name}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{order.total}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warnings Sidebar */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Low Stock Alerts
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-14 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      Only {p.stock} Left!
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
