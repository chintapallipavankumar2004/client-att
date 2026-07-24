import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    siteSettings,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setSelectedProductSlug,
    setCurrentView
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '1Y');
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      selectedSize,
      product.colors[0]?.name || 'Standard',
      product.ageGroups[0] || '1-2Y',
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    setIsSizeSelectorOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsSizeSelectorOpen(false);
      }}
      onClick={() => {
        setSelectedProductSlug(product.slug);
        setCurrentView('product');
      }}
      className="group relative bg-white rounded-3xl border border-rose-100 shadow-xs hover:shadow-2xl hover:border-rose-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Top Image & Badges Container */}
      <div className="relative aspect-4/5 w-full bg-slate-50 overflow-hidden">
        {/* Main Product Image */}
        <img
          src={isHovered && hasSecondImage ? product.images[1] : product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isFlashDeal && (
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider animate-pulse">
              ⚡ FLASH DEAL
            </span>
          )}
          {product.isNew && !product.isFlashDeal && (
            <span className="bg-emerald-500 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions Hover Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs py-2 px-3 rounded-full shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Age Tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-rose-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
              {product.ageGroups[0]}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Rating Stars & Baby Safe Badge */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-slate-400 text-[10px] font-normal">({product.reviewCount})</span>
          </div>

          {product.isBabySafe && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Baby Safe
            </span>
          )}
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 relative">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">
                {siteSettings.currencySymbol}{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {siteSettings.currencySymbol}{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick Size Selector Drawer / Add to Bag Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (product.sizes.length === 1) {
                  handleQuickAdd(e);
                } else {
                  setIsSizeSelectorOpen(!isSizeSelectorOpen);
                }
              }}
              className={`p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white'
              }`}
              title="Add to Bag"
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>

            {/* Size Selector Popup */}
            {isSizeSelectorOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-rose-100 p-3 z-30 w-44 space-y-2 animate-scale"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase">Select Size:</div>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleQuickAdd}
                  className="w-full bg-rose-600 text-white text-xs font-bold py-1.5 rounded-xl hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Confirm Add ({selectedSize})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
