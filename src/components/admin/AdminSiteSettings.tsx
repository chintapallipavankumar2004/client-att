import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, Check, Sparkles, ShieldAlert } from 'lucide-react';

export const AdminSiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();

  const [form, setForm] = useState({ ...siteSettings });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-500" /> General Store Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure business metadata, support contacts, tax percentages, and free shipping triggers.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Store Name</label>
            <input
              type="text"
              required
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Tagline / Subtitle</label>
            <input
              type="text"
              required
              value={form.storeTagline}
              onChange={e => setForm({ ...form, storeTagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Support Phone Number</label>
            <input
              type="text"
              required
              value={form.supportPhone}
              onChange={e => setForm({ ...form, supportPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Support Email</label>
            <input
              type="email"
              required
              value={form.supportEmail}
              onChange={e => setForm({ ...form, supportEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1">Headquarters Physical Address</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Free Shipping Trigger (₹)</label>
            <input
              type="number"
              required
              value={form.freeShippingThreshold}
              onChange={e => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              required
              value={form.shippingFee}
              onChange={e => setForm({ ...form, shippingFee: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">GST Tax Rate (%)</label>
            <input
              type="number"
              required
              value={form.taxPercent}
              onChange={e => setForm({ ...form, taxPercent: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={e => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="rounded text-rose-600 focus:ring-0"
            />
            <div>
              <span className="font-bold text-rose-400">Enable Maintenance Mode</span>
              <p className="text-[10px] text-slate-400">Displays "Store Under Maintenance" banner to visiting parents.</p>
            </div>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          {saved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Store Settings Updated!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
