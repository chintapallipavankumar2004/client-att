import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Mic,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    siteSettings,
    cart,
    wishlist,
    setIsCartOpen,
    setIsTrackOrderOpen,
    currentView,
    setCurrentView,
    activeCategoryFilter,
    searchQuery,
    setSearchQuery,
    categories,
    ageCategories,
    setActiveCategoryFilter,
    setActiveAgeFilter,
    products,
    setSelectedProductSlug,
    announcements,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchSuggestions =
    searchQuery.trim().length > 1
      ? products
          .filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setIsSearchFocused(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    window.setTimeout(() => {
      setSearchQuery('Frock');
      setIsListeningVoice(false);
      setCurrentView('shop');
    }, 1500);
  };

  const activeAnnouncements = announcements.filter((announcement) => announcement.active);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-rose-100">
      {activeAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-xs font-medium py-1.5 px-4 overflow-hidden relative">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                HOT
              </span>
              <p className="line-clamp-1 animate-pulse">{activeAnnouncements[0]?.text}</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
              <button
                onClick={() => setIsTrackOrderOpen(true)}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" /> Track Order
              </button>
              <span>|</span>
              <a href={`tel:${siteSettings.supportPhone}`} className="flex items-center gap-1 hover:underline">
                <Phone className="w-3.5 h-3.5" /> {siteSettings.supportPhone}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
            className="lg:hidden p-2 text-slate-700 hover:text-rose-600 rounded-lg hover:bg-rose-50"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => {
              setCurrentView('home');
              setActiveCategoryFilter(null);
              setActiveAgeFilter(null);
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block font-serif">
                Akshvik <span className="text-rose-600 font-sans text-lg sm:text-xl font-bold">Tiny Trends</span>
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase text-slate-400 block -mt-1">
                Luxury Kids Fashion
              </span>
            </div>
          </button>

          <div className="hidden md:block flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search frocks, kurtas, onesies, jackets..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-12 py-2.5 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 text-sm transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Voice Search"
                className={`absolute right-3 top-2.5 p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                  isListeningVoice ? 'animate-bounce text-rose-600' : ''
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </form>

            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden z-50 p-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Suggested Products
                </div>
                {searchSuggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProductSlug(product.slug);
                      setCurrentView('product');
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-rose-50/60 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                      <p className="text-[11px] font-bold text-rose-600">
                        {siteSettings.currencySymbol}
                        {product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('shop');
              }}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2 shadow-md shadow-rose-200 transition-all transform hover:scale-105 cursor-pointer font-bold text-xs"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-rose-600 font-black text-xs px-2 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search kids fashion & baby clothes..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-10 py-2 rounded-full bg-slate-100 text-xs border border-slate-200 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button type="button" onClick={handleVoiceSearch} className="absolute right-3 top-2 text-slate-400">
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/50 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setCurrentView('home');
                setActiveCategoryFilter(null);
                setActiveAgeFilter(null);
              }}
              className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
                currentView === 'home' ? 'text-rose-600 font-bold border-b-2 border-rose-600' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                setActiveCategoryFilter(null);
                setActiveAgeFilter(null);
              }}
              className={`hover:text-rose-600 transition-colors py-1 cursor-pointer ${
                currentView === 'shop' && !activeCategoryFilter ? 'text-rose-600 font-bold' : ''
              }`}
            >
              Shop All
            </button>

            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-rose-600 transition-colors py-1 cursor-pointer">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategoryFilter(category.slug);
                      setCurrentView('shop');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-slate-800">{category.name}</span>
                    {category.discountPercent ? (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                        {category.discountPercent}% OFF
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-normal uppercase text-[10px]">Age:</span>
              {ageCategories.slice(0, 5).map((age) => (
                <button
                  key={age.id}
                  onClick={() => {
                    setActiveAgeFilter(age.range);
                    setCurrentView('shop');
                  }}
                  className="bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-rose-600 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs"
                >
                  {age.range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setCurrentView('shop');
              }}
              className="text-rose-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Flash Offers
            </button>
            <button
              onClick={() => setCurrentView('blog')}
              className={`hover:text-rose-600 cursor-pointer ${currentView === 'blog' ? 'text-rose-600 font-bold' : ''}`}
            >
              Blog & Tips
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`hover:text-rose-600 cursor-pointer ${currentView === 'about' ? 'text-rose-600 font-bold' : ''}`}
            >
              About Us
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-rose-100 px-4 pt-3 pb-6 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-rose-50 text-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentView('shop');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-rose-50 text-slate-800"
              >
                Shop All
              </button>
              <button
                onClick={() => {
                  setIsTrackOrderOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-rose-50 text-slate-800"
              >
                Track Order
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategoryFilter(category.slug);
                      setCurrentView('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-rose-50 text-rose-800 font-medium px-3 py-1.5 rounded-full text-xs"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop By Age</p>
              <div className="flex flex-wrap gap-1.5">
                {ageCategories.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => {
                      setActiveAgeFilter(age.range);
                      setCurrentView('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-purple-50 text-purple-800 font-bold px-3 py-1.5 rounded-full text-xs"
                  >
                    {age.range}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
