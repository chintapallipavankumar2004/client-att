import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from '../../types';
import { Plus, Trash2, Edit3, Image, Check, Eye, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminBannerManager: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    badgeText: 'FESTIVE SPECIAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    desktopImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    bgColor: '#fdf2f8',
    textColor: '#831843',
    priority: 1,
    active: true
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setForm({
      title: 'New Royal Festive Season',
      subtitle: 'Handcrafted Heritage Outfits for Little Princes',
      badgeText: 'FESTIVE EDITION',
      buttonText: 'Explore Styles',
      buttonLink: '/shop',
      desktopImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1600&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      bgColor: '#fdf2f8',
      textColor: '#831843',
      priority: banners.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      badgeText: banner.badgeText || '',
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage,
      bgColor: banner.bgColor || '#fdf2f8',
      textColor: banner.textColor || '#831843',
      priority: banner.priority,
      active: banner.active
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, form);
    } else {
      addBanner(form);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hero banner?')) {
      deleteBanner(id);
    }
  };

  const handleToggleActive = (banner: HeroBanner) => {
    updateBanner(banner.id, { active: !banner.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white font-serif">
            Flipkart-Style Hero Banner Slider CMS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage main homepage sliders, schedule publish dates, image URLs, and CTA buttons.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Banners List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden space-y-3 p-4">
            {/* Banner Preview Card */}
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img src={b.desktopImage} alt={b.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 p-4 flex flex-col justify-end text-white">
                <span className="bg-rose-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full w-fit mb-1">
                  {b.badgeText || 'BANNER'}
                </span>
                <h4 className="font-bold text-sm line-clamp-1">{b.title}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">{b.subtitle}</p>
              </div>
            </div>

            {/* Banner Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(b)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                    b.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {b.active ? '● Active' : '○ Inactive'}
                </button>
                <span className="font-mono text-[11px]">Priority: #{b.priority}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  title="Edit Banner"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 my-8 text-slate-100">
            <h3 className="font-bold text-lg text-white font-serif">
              {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Subtitle / Catchphrase</label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={e => setForm({ ...form, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={e => setForm({ ...form, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Desktop Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={form.desktopImage}
                  onChange={e => setForm({ ...form, desktopImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Mobile Banner Image URL</label>
                <input
                  type="text"
                  value={form.mobileImage}
                  onChange={e => setForm({ ...form, mobileImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Button Link</label>
                  <input
                    type="text"
                    value={form.buttonLink}
                    onChange={e => setForm({ ...form, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Display Priority Order</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={e => setForm({ ...form, active: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span className="font-bold text-white">Active & Published</span>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
