import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Heart,
  RotateCcw,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    siteSettings,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductSlug,
    setCurrentView
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryEst, setDeliveryEst] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isLiked = isInWishlist(product.id);

  const activeSize = selectedSize || product.sizes[0] || '1Y';
  const activeColor = selectedColor || product.colors[0]?.name || 'Standard';

  const handleAddToCart = () => {
    addToCart(
      product,
      activeSize,
      activeColor,
      product.ageGroups[0] || '1-2Y',
      quantity
    );
    setQuickViewProduct(null);
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setDeliveryEst('Fast Delivery available by Tomorrow! COD Eligible.');
    } else {
      setDeliveryEst('Standard Delivery in 2-3 Business Days.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 my-8 overflow-hidden animate-scale"
      >
        {/* Close Modal Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={handleShare}
                className="absolute top-3 left-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md cursor-pointer"
                title="Share Product"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === activeImageIndex ? 'border-rose-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
                <span>{product.brand}</span>
                <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full">
                  Age: {product.ageGroups.join(', ')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">{product.reviewCount} Verified Reviews</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Baby Safe
                </span>
              </div>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
              <span className="text-2xl font-black text-slate-900">
                {siteSettings.currencySymbol}{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {siteSettings.currencySymbol}{product.originalPrice}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Colors Picker */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Color: <span className="text-rose-600">{activeColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        activeColor === col.name ? 'border-rose-600 scale-110 shadow-md' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Picker */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Size: <span className="text-rose-600">{activeSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        activeSize === sz
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-102 text-xs sm:text-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Bag
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                  isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Delivery Estimator Form */}
            <div className="pt-3 border-t border-slate-100">
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Pin Code (e.g. 500033)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-1.5 rounded-xl hover:bg-rose-600 transition-colors"
                >
                  Check Pin
                </button>
              </form>
              {deliveryEst && (
                <p className="text-[11px] font-medium text-emerald-700 bg-emerald-50 p-2 rounded-xl mt-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> {deliveryEst}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedProductSlug(product.slug);
                setCurrentView('product');
                setQuickViewProduct(null);
              }}
              className="w-full text-center text-xs font-bold text-rose-600 hover:underline pt-2 block"
            >
              View Full Product Details & Fabric Specifications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
