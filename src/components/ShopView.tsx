import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    ageCategories,
    activeCategoryFilter,
    setActiveCategoryFilter,
    activeAgeFilter,
    setActiveAgeFilter,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Apply filters
  let filtered = [...products];

  if (activeCategoryFilter) {
    filtered = filtered.filter(p => p.categories.includes(activeCategoryFilter));
  }

  if (activeAgeFilter) {
    filtered = filtered.filter(p => p.ageGroups.includes(activeAgeFilter));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }

  filtered = filtered.filter(p => p.price <= maxPrice);

  // Apply sorting
  if (selectedSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Heading & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
            {activeCategoryFilter
              ? categories.find(c => c.slug === activeCategoryFilter)?.name || 'Category'
              : activeAgeFilter
              ? `Outfits for ${activeAgeFilter}`
              : 'Shop All Kids Collection'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filtered.length} styles crafted with skin-safe premium materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 pr-4 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(activeCategoryFilter || activeAgeFilter || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Filters:</span>
          {activeCategoryFilter && (
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              Category: {activeCategoryFilter}
              <button onClick={() => setActiveCategoryFilter(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {activeAgeFilter && (
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              Age: {activeAgeFilter}
              <button onClick={() => setActiveAgeFilter(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={() => {
              setActiveCategoryFilter(null);
              setActiveAgeFilter(null);
              setSearchQuery('');
            }}
            className="text-xs text-rose-600 font-bold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-rose-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-rose-600" /> Filter Outfits
            </h3>
          </div>

          {/* Categories Filter */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setActiveCategoryFilter(null)}
                className={`w-full text-left py-1.5 px-3 rounded-xl transition-colors font-medium ${
                  activeCategoryFilter === null ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-rose-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryFilter(c.slug)}
                  className={`w-full text-left py-1.5 px-3 rounded-xl transition-colors font-medium ${
                    activeCategoryFilter === c.slug ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filter */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age Group</p>
            <div className="flex flex-wrap gap-1.5">
              {ageCategories.map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveAgeFilter(activeAgeFilter === a.range ? null : a.range)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    activeAgeFilter === a.range
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                  }`}
                >
                  {a.range}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Max Price:</span>
              <span className="text-rose-600 font-mono">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={500}
              max={3500}
              step={100}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-rose-50/40 rounded-3xl border border-rose-100 p-8 space-y-3">
              <Sparkles className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No outfits match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your active filters or searching for another keyword.
              </p>
              <button
                onClick={() => {
                  setActiveCategoryFilter(null);
                  setActiveAgeFilter(null);
                  setSearchQuery('');
                  setMaxPrice(3500);
                }}
                className="bg-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-rose-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
