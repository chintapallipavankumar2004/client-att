import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category, AgeCategory } from '../../types';
import { Plus, Trash2, Edit3, Layers, Calendar, Check } from 'lucide-react';

export const AdminCategoryManager: React.FC = () => {
  const { categories, ageCategories, addCategory, updateCategory, deleteCategory } = useStore();

  const [activeTab, setActiveTab] = useState<'categories' | 'age'>('categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    image: '',
    icon: 'Sparkles',
    itemCount: 0,
    priority: 1,
    discountBadge: 'Up to 30% OFF'
  });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setForm({
      name: 'Infant Bath & Pajamas',
      slug: 'infant-bath-pajamas',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      icon: 'Heart',
      itemCount: 14,
      priority: categories.length + 1,
      discountBadge: 'Flat 20% OFF'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCat(c);
    setForm({
      name: c.name,
      slug: c.slug,
      image: c.image,
      icon: c.icon || 'Sparkles',
      itemCount: c.itemCount,
      priority: c.priority,
      discountBadge: c.discountBadge || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateCategory(editingCat.id, form);
    } else {
      addCategory({ ...form, active: true, isFeatured: true });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif">
            Category & Age Group CMS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage category grid tiles, age filter pills, and discount offer badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.id} className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img src={c.image} alt={c.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {c.discountBadge || 'POPULAR'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm font-serif">{c.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{c.slug}</p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 my-8 text-slate-100">
            <h3 className="font-bold text-lg text-white font-serif">
              {editingCat ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Discount Offer Badge</label>
                <input
                  type="text"
                  value={form.discountBadge}
                  onChange={e => setForm({ ...form, discountBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
