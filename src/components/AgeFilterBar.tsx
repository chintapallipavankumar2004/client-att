import React from 'react';
import { useStore } from '../context/StoreContext';
import { Baby, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const AgeFilterBar: React.FC = () => {
  const { ageCategories, activeAgeFilter, setActiveAgeFilter, setCurrentView } = useStore();
  const activeAges = ageCategories.filter(a => a.active).sort((a, b) => a.priority - b.priority);

  return (
    <section className="py-8 bg-white border-y border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest inline-flex items-center gap-1">
            <Baby className="w-4 h-4" /> Perfect Size Match
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif mt-1">
            Shop By Age Group
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Find tailored fits designed specifically for your child’s growth stage.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setActiveAgeFilter(null);
              setCurrentView('shop');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              activeAgeFilter === null
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            All Ages
          </button>

          {activeAges.map((age, idx) => {
            const isSelected = activeAgeFilter === age.range;
            return (
              <motion.button
                key={age.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setActiveAgeFilter(age.range);
                  setCurrentView('shop');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200 scale-105'
                    : 'bg-white text-slate-800 border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 hover:scale-102'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-rose-400'}`} />
                <span>{age.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'
                }`}>
                  {age.range}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
