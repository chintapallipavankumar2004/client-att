import React from 'react';
import { Instagram, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const InstagramGallery: React.FC = () => {
  const { setCurrentView } = useStore();

  const posts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80', tag: '#AkshvikLittlePrincess' },
    { id: 2, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80', tag: '#FestivePrinceLook' },
    { id: 3, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80', tag: '#OrganicBabyCare' },
    { id: 4, image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80', tag: '#WinterTeddyVibes' },
    { id: 5, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80', tag: '#NewbornTreasures' },
    { id: 6, image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80', tag: '#StarryNightSleep' }
  ];

  return (
    <section className="py-12 bg-white border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
              <Instagram className="w-4 h-4" /> @akshvik_tinytrends
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Tagged By Parents On Instagram
            </h2>
          </div>
          <a
            href="https://instagram.com/akshvik_tinytrends"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-md hover:opacity-95 transition-opacity"
          >
            Follow Us On Instagram
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map(p => (
            <div
              key={p.id}
              onClick={() => setCurrentView('shop')}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-rose-50"
            >
              <img
                src={p.image}
                alt={p.tag}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white space-y-1">
                <ShoppingBag className="w-5 h-5 text-rose-300" />
                <p className="text-[10px] font-bold tracking-wider">{p.tag}</p>
                <span className="text-[9px] bg-white text-slate-900 font-bold px-2 py-0.5 rounded-full">Shop Look</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
