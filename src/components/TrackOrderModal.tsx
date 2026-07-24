import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Truck, CheckCircle2, Clock, Package, MapPin } from 'lucide-react';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('ATT-2026-8912');
  const [foundOrder, setFoundOrder] = useState<Order | null>(orders[0] || null);
  const [searched, setSearched] = useState(true);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    const match = orders.find(
      o => o.orderNumber.toLowerCase() === q ||
           o.trackingNumber.toLowerCase() === q ||
           o.customer.phone.includes(q) ||
           o.id.toLowerCase() === q
    );
    setFoundOrder(match || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 my-8 animate-scale"
      >
        <button
          onClick={() => setIsTrackOrderOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Track Your Order
          </h2>
          <p className="text-xs text-slate-500">
            Enter your Order Number, Tracking ID, or registered Mobile Number.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. ATT-2026-8912 or DEL-IND-902184"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Search Results / Visual Order Timeline */}
        {searched && !foundOrder && (
          <div className="text-center py-8 bg-rose-50/50 rounded-2xl p-4 border border-rose-100 text-xs text-slate-600">
            <p className="font-bold text-slate-800">No order found matching "{searchQuery}"</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Try searching with test order number: <strong className="text-rose-600">ATT-2026-8912</strong>
            </p>
          </div>
        )}

        {foundOrder && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Order Number</p>
                <p className="font-black text-slate-900 font-mono text-sm">{foundOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Courier Partner</p>
                <p className="font-bold text-slate-800">{foundOrder.trackingCarrier}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Tracking ID</p>
                <p className="font-bold text-rose-600 font-mono">{foundOrder.trackingNumber}</p>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Shipment Journey</p>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {foundOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        step.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">({step.date})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Package Items</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {foundOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
