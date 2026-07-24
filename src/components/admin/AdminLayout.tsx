import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { navigateToPath } from '../../lib/browserRouting';
import { type AdminTab } from '../../shared/adminAccess';
import { DEVELOPMENT_ADMIN_MODE } from '../../shared/adminMode';
import {
  LayoutDashboard,
  Image,
  Tag,
  Package,
  Layers,
  ShoppingBag,
  Users,
  MessageSquare,
  Percent,
  Settings,
  Sparkles,
  X,
  Eye,
  Megaphone,
  LayoutGrid
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    siteSettings,
    refetchAllData
  } = useStore();
  const { canAccessTab, logout } = useAdminAuth();

  const menuItems: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard Analytics', icon: LayoutDashboard },
    { id: 'banners', label: 'Hero Banners (Flipkart Style)', icon: Image },
    { id: 'announcements', label: 'Scrolling Offer Strip', icon: Megaphone },
    { id: 'homepage_builder', label: 'Homepage Layout Builder', icon: LayoutGrid },
    { id: 'products', label: 'Product Catalog & AI Copy', icon: Package },
    { id: 'categories', label: 'Categories & Age Groups', icon: Layers },
    { id: 'orders', label: 'Orders & Invoice Generator', icon: ShoppingBag },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Percent },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'reviews', label: 'Reviews & Ratings', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings & Theme', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-white text-base tracking-tight font-serif flex items-center gap-2">
              Akshvik Admin CMS <span className="bg-rose-600 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded-full">v2.5 Live</span>
            </h1>
            <p className="text-[10px] text-slate-400">Enterprise Content & Store Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchAllData()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
          >
            🔄 Sync Data
          </button>
          <button
            onClick={() => navigateToPath('/')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Eye className="w-4 h-4" /> View Live Store
          </button>
          {!DEVELOPMENT_ADMIN_MODE ? (
            <button
              onClick={() => void logout()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      {/* Main Admin Sidebar + Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-950/80 border-r border-slate-800 p-4 space-y-1 shrink-0 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation</p>
          {menuItems.filter((item) => canAccessTab(item.id)).map(item => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-900 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};
