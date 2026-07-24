import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LayoutGrid, Eye, EyeOff, ArrowUp, ArrowDown, Save, Check } from 'lucide-react';

export const AdminHomepageBuilder: React.FC = () => {
  const { homepageLayout = [], setHomepageLayout, refetchAllData } = useStore();
  const [sections, setSections] = useState(() =>
    [...(homepageLayout || [])]
      .map(sec => ({
        ...sec,
        enabled: sec.enabled !== undefined ? sec.enabled : (sec.visible !== undefined ? sec.visible : true),
        order: sec.order !== undefined ? sec.order : (sec.priority !== undefined ? sec.priority : 1)
      }))
      .sort((a, b) => a.order - b.order)
  );
  const [saved, setSaved] = useState(false);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled, visible: !s.enabled } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    // Update order key
    const reordered = updated.map((sec, i) => ({ ...sec, order: i + 1, priority: i + 1 }));
    setSections(reordered);
  };

  const handleSave = () => {
    setHomepageLayout(sections);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-rose-500" /> Homepage Layout Builder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag/reorder sections or toggle their visibility live on the homepage without touching code.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Layout Saved!' : 'Save Layout'}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              sec.enabled
                ? 'bg-slate-950 border-slate-800 text-white'
                : 'bg-slate-950/40 border-slate-900 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold w-6 text-slate-500">#{index + 1}</span>
              <div>
                <h4 className="font-bold text-sm font-serif">{sec.title}</h4>
                <p className="text-[10px] text-slate-500 font-mono">Component ID: {sec.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => toggleSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  sec.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {sec.enabled ? 'Enabled' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
