import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const { products, setCurrentView } = useStore();
  const flashProducts = products.filter(p => p.isFlashDeal);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 relative overflow-hidden text-white">
      {/* Background Decorative Ripples */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-amber-200 border border-white/20 mb-2">
              <Zap className="w-4 h-4 text-amber-300 animate-bounce" /> Today's Super Flash Sale
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif drop-shadow-md">
              Grab Up To 40% OFF Before Stock Ends!
            </h2>
          </div>

          {/* Animated Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-2xl">
            <Clock className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mr-2">Ends In:</span>
            <div className="flex items-center gap-2 font-mono text-xl font-black text-amber-300">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-rose-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashProducts.slice(0, 4).map(product => (
            <div key={product.id} className="text-slate-900">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-900 text-rose-600 hover:text-white font-black px-8 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 cursor-pointer text-sm"
          >
            Explore All Flash Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
