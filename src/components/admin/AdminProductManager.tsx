import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Search, Trash2, Edit3, Sparkles, Wand2, Check } from 'lucide-react';

export const AdminProductManager: React.FC = () => {
  const { products, categories, ageCategories, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    price: 999,
    originalPrice: 1499,
    discountPercent: 33,
    categories: ['girls-fashion'],
    ageGroups: ['1-2Y', '2-3Y'],
    sizes: ['1Y', '2Y', '3Y'],
    colors: [{ name: 'Royal Pink', hex: '#ec4899' }],
    brand: 'Akshvik Exclusive',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'],
    description: '',
    fabricDetails: '100% Organic Combed Cotton, GOTS Certified Skin-Friendly Dye.',
    careInstructions: 'Machine wash cold, gentle cycle with mild baby detergent.',
    stock: 50,
    isNewArrival: true,
    isFeatured: true,
    isFlashDeal: false
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: 'Princess Organza Festive Lehenga',
      slug: 'princess-organza-festive-lehenga',
      sku: 'AK-LEH-001',
      price: 1899,
      originalPrice: 2499,
      discountPercent: 24,
      categories: ['festive-wear'],
      ageGroups: ['1-2Y', '2-3Y', '3-4Y'],
      sizes: ['1Y', '2Y', '3Y', '4Y'],
      colors: [{ name: 'Lotus Pink', hex: '#f43f5e' }, { name: 'Gold', hex: '#eab308' }],
      brand: 'Akshvik Royal Heritage',
      images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'],
      description: 'Handcrafted floral organza lehenga with soft pure cotton lining for maximum comfort during long weddings and festivities.',
      fabricDetails: 'Pure Organza Outer Shell with 100% Breathable Cotton Inner Lining.',
      careInstructions: 'Dry clean recommended for first wash.',
      stock: 30,
      isNewArrival: true,
      isFeatured: true,
      isFlashDeal: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      categories: p.categories,
      ageGroups: p.ageGroups,
      sizes: p.sizes,
      colors: p.colors,
      brand: p.brand,
      images: p.images,
      description: p.description,
      fabricDetails: p.fabricDetails,
      careInstructions: p.careInstructions,
      stock: p.stock,
      isNewArrival: p.isNewArrival,
      isFeatured: p.isFeatured,
      isFlashDeal: p.isFlashDeal
    });
    setIsModalOpen(true);
  };

  const handleGenerateAiCopy = async () => {
    if (!form.name) {
      alert('Please enter a Product Name first.');
      return;
    }
    try {
      setIsAiGenerating(true);
      await new Promise(r => setTimeout(r, 500));
      setForm(prev => ({
        ...prev,
        description: `Crafted with premium ultra-soft organic combed cotton for ${prev.name}. Designed specifically for active kids with irritation-free flatlock seams and tagless neckband. Keeps your child comfortable and stylish all day long.`,
        fabricDetails: prev.fabricDetails || '100% Super Combed Organic Cotton, OEKO-TEX Certified Eco Dyes',
        careInstructions: prev.careInstructions || 'Machine wash cold inside out with mild detergent. Tumble dry low or line dry in shade.'
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form as any);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCat || p.categories.includes(selectedCat);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif">
            Product Catalog Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add/edit outfits, update inventory stock levels, and generate AI copywriting.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Outfit
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Age Groups</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 flex items-center gap-3 font-medium">
                    <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded-xl" />
                    <div>
                      <p className="font-bold text-white text-xs">{p.name}</p>
                      <p className="text-[10px] text-rose-400 font-bold">{p.brand}</p>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">{p.sku}</td>
                  <td className="p-3.5 font-bold text-emerald-400">₹{p.price} <span className="line-through text-slate-500 text-[10px]">₹{p.originalPrice}</span></td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock > 15 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px]">{p.ageGroups.join(', ')}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-4 my-8 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white font-serif">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={handleGenerateAiCopy}
                disabled={isAiGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4 text-amber-300 animate-spin-slow" />
                {isAiGenerating ? 'Generating AI Copy...' : 'Generate AI Copywriting'}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.originalPrice}
                    onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Main Image URL</label>
                <input
                  type="text"
                  required
                  value={form.images[0] || ''}
                  onChange={e => setForm({ ...form, images: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">AI Generated / Product Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Fabric & Safety Specs</label>
                  <input
                    type="text"
                    value={form.fabricDetails}
                    onChange={e => setForm({ ...form, fabricDetails: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Washing Care</label>
                  <input
                    type="text"
                    value={form.careInstructions}
                    onChange={e => setForm({ ...form, careInstructions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFlashDeal}
                    onChange={e => setForm({ ...form, isFlashDeal: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span className="font-bold text-amber-300">⚡ Flash Deal Section</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={e => setForm({ ...form, isNewArrival: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span className="font-bold text-white">✨ New Arrival Badge</span>
                </label>
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
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
