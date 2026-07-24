import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Megaphone, Check, Sparkles } from 'lucide-react';

export const AdminAnnouncementManager: React.FC = () => {
  const { announcements, updateAnnouncement } = useStore();
  const ann = announcements[0] || {
    id: 'ann-1',
    text: '🎉 FESTIVE SPECIAL: Extra 15% OFF on Indian Ethnic Wear | Code: FESTIVE15 | Free Express Shipping > ₹999',
    bgColor: '#e11d48',
    textColor: '#ffffff',
    speed: 25,
    active: true
  };

  const [form, setForm] = useState({
    text: ann.text,
    bgColor: ann.bgColor,
    textColor: ann.textColor,
    speed: ann.speed,
    active: ann.active
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(ann.id, form);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
          <Megaphone className="w-4 h-4" /> Header Marquee Strip
        </div>
        <h2 className="text-xl font-black text-white font-serif">
          Top Scrolling Announcement Ticker
        </h2>
        <p className="text-xs text-slate-400">
          Customize the moving banner message displayed at the very top of the website.
        </p>
      </div>

      {/* Live Preview Strip */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400">Live Preview:</span>
        <div
          className="p-2.5 rounded-xl font-medium text-xs overflow-hidden flex items-center justify-center font-serif shadow-md"
          style={{ backgroundColor: form.bgColor, color: form.textColor }}
        >
          {form.active ? form.text : ' Strip Disabled '}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Announcement Message Text</label>
          <input
            type="text"
            required
            value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.bgColor}
                onChange={e => setForm({ ...form, bgColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                value={form.bgColor}
                onChange={e => setForm({ ...form, bgColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.textColor}
                onChange={e => setForm({ ...form, textColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                value={form.textColor}
                onChange={e => setForm({ ...form, textColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Scroll Speed Duration ({form.speed}s)
          </label>
          <input
            type="range"
            min={10}
            max={60}
            value={form.speed}
            onChange={e => setForm({ ...form, speed: Number(e.target.value) })}
            className="w-full accent-rose-600"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm({ ...form, active: e.target.checked })}
              className="rounded text-rose-600 focus:ring-0"
            />
            <span className="font-bold text-white">Enable & Publish Strip on Live Store</span>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between">
          {savedMsg ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes Saved!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            Save Announcement
          </button>
        </div>
      </form>
    </div>
  );
};
