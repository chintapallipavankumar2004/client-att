import React from 'react';
import { useStore, StoreProvider } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { AgeFilterBar } from './components/AgeFilterBar';
import { FlashDeals } from './components/FlashDeals';
import { ProductCard } from './components/ProductCard';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { InstagramGallery } from './components/InstagramGallery';
import { Footer } from './components/Footer';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminView } from './components/AdminView';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isAdminOpen,
    homepageLayout,
    products
  } = useStore();

  if (isAdminOpen) {
    return <AdminView />;
  }

  const newArrivals = (products || []).filter(p => p.isNew || (p as any).isNewArrival);
  const featuredProducts = (products || []).filter(p => p.isFeatured || p.isBestSeller || p.isTrending);

  const activeSections = (homepageLayout || []).map(sec => ({
    ...sec,
    enabled: sec.enabled !== undefined ? sec.enabled : (sec.visible !== undefined ? sec.visible : true),
    order: sec.order !== undefined ? sec.order : (sec.priority !== undefined ? sec.priority : 1)
  }));

  // Render dynamic Homepage Section
  const renderHomeSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero_slider':
        return <HeroSlider key={sectionId} />;
      case 'category_grid':
        return <CategoryGrid key={sectionId} />;
      case 'age_filter':
        return <AgeFilterBar key={sectionId} />;
      case 'flash_deals':
        return <FlashDeals key={sectionId} />;
      case 'new_arrivals':
        return (
          <section key={sectionId} className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Just Unboxed
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
                    New Arrivals For Little Ones
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  View All Outfits <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      case 'featured':
        return (
          <section key={sectionId} className="py-12 bg-rose-50/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                  Parent Favorites
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif mt-1">
                  Trending Best Sellers
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      case 'why_choose_us':
        return <WhyChooseUs key={sectionId} />;
      case 'testimonials':
        return <TestimonialCarousel key={sectionId} />;
      case 'instagram_gallery':
        return <InstagramGallery key={sectionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <div>
        <AnnouncementBar />
        <Header />

        <main>
          {currentView === 'home' && (
            <div>
              {activeSections
                .filter(sec => sec.enabled)
                .sort((a, b) => a.order - b.order)
                .map(sec => renderHomeSection(sec.type || sec.id))}
            </div>
          )}

          {currentView === 'shop' && <ShopView />}
          {currentView === 'product' && <ProductDetailView />}
          {currentView === 'checkout' && <CheckoutModal />}

          {currentView === 'about' && (
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-center">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Our Heritage Story</span>
              <h1 className="text-3xl sm:text-5xl font-black font-serif text-slate-900">
                About Akshvik Tiny Trends
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Akshvik Tiny Trends was born out of a mother's dream to give kids apparel that balances royal festive elegance with 100% skin-friendly organic comfort. Every stitch is crafted without sharp tags or synthetic dyes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md">
                  <ShieldCheck className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm">GOTS Certified Organic</h3>
                  <p className="text-xs text-slate-500 mt-1">Chemical-free pure cottons.</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md">
                  <Heart className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm">Crafted By Artisans</h3>
                  <p className="text-xs text-slate-500 mt-1">Traditional hand-block & embroidery.</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-md">
                  <Sparkles className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm">50,000+ Happy Families</h3>
                  <p className="text-xs text-slate-500 mt-1">Delivering smiles across India.</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'blog' && (
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
              <div className="text-center">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Parenting Journal</span>
                <h1 className="text-3xl sm:text-5xl font-black font-serif text-slate-900 mt-1">
                  Tiny Trends Parenting Blog
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-md">
                  <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80" alt="Blog 1" className="w-full h-48 object-cover" />
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Fabric Care</span>
                    <h3 className="font-black text-slate-900 text-base font-serif">5 Washing Secrets for Newborn Organic Clothes</h3>
                    <p className="text-xs text-slate-600">Keep soft baby romper fabrics plush and hypoallergenic wash after wash.</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-md">
                  <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80" alt="Blog 2" className="w-full h-48 object-cover" />
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Festive Styling</span>
                    <h3 className="font-black text-slate-900 text-base font-serif">How to Style Kids for Long Festive Weddings Without Fuss</h3>
                    <p className="text-xs text-slate-600">Selecting itch-free organza lehengas with pure cotton under-linings.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Drawers */}
      <ProductQuickViewModal />
      <CartDrawer />
      <TrackOrderModal />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}

export default App;
