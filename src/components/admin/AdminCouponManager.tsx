import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Percent, Plus, Trash2, Check } from 'lucide-react';

export const AdminCouponManager: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: 'FESTIVE25',
    discountType: 'percent' as 'percent' | 'flat',
    discountValue: 25,
    minSpend: 999,
    usageLimit: 500,
    active: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({ ...form, usedCount: 0 });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete coupon?')) {
      deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
            <Percent className="w-5 h-5 text-rose-500" /> Coupon & Discount Manager
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create promotional codes, minimum order value thresholds, and usage limits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons.map(c => (
          <div key={c.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-amber-400 tracking-wider bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                {c.code}
              </span>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>Discount: <strong className="text-emerald-400">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}</strong></p>
              <p>Min Order Spend: <strong>₹{c.minSpend}</strong></p>
              <p>Used: <strong>{c.timesUsed} / {c.usageLimit} times</strong></p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-slate-100">
            <h3 className="font-bold text-lg text-white font-serif">Create Coupon Code</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Minimum Spend (₹)</label>
                <input
                  type="number"
                  required
                  value={form.minSpend}
                  onChange={e => setForm({ ...form, minSpend: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 text-white font-bold px-6 py-2 rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
