import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Sun, Snowflake, HeartHandshake, Baby, Moon, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoryGrid: React.FC = () => {
  const { categories, setActiveCategoryFilter, setCurrentView } = useStore();
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.priority - b.priority);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-sky-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'Baby': return <Baby className="w-5 h-5 text-pink-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-500" />;
      default: return <Shirt className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Curated For Tiny Tots
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
              Shop By Category
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategoryFilter(null);
              setCurrentView('shop');
            }}
            className="mt-2 md:mt-0 text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group cursor-pointer"
          >
            Explore All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => {
                setActiveCategoryFilter(cat.slug);
                setCurrentView('shop');
              }}
              className="group relative bg-white rounded-2xl p-3 border border-rose-100 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {cat.discountPercent ? (
                <div className="absolute top-2 right-2 z-10 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                  {cat.discountPercent}% OFF
                </div>
              ) : null}

              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-rose-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-rose-50 mb-1 group-hover:bg-rose-100 transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {cat.productCount || 15}+ Styles
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
