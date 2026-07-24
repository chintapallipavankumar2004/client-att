import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Star,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  Share2,
  Check,
  Sparkles,
  Ruler,
  MessageSquare
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductSlug,
    products,
    siteSettings,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    setCurrentView
  } = useStore();

  const product = products.find(p => p.slug === selectedProductSlug) || products[0];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '1Y');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  if (!product) return null;

  const isLiked = isInWishlist(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'Approved');
  const relatedProducts = products.filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c))).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, product.ageGroups[0] || '1-2Y', quantity);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus('Express Delivery available! Guaranteed drop-off in 2 days. Cash on Delivery available.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment || !reviewAuthor) return;

    try {
      addReview({
        productId: product.id,
        productName: product.name,
        customerName: reviewAuthor,
        rating: reviewRating,
        title: reviewTitle || 'Great purchase!',
        comment: reviewComment
      });
      setSubmittedReview(true);
      setReviewComment('');
      setReviewTitle('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <button onClick={() => setCurrentView('home')} className="hover:text-rose-600">Home</button>
        <span>/</span>
        <button onClick={() => setCurrentView('shop')} className="hover:text-rose-600">Shop</button>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate">{product.name}</span>
      </div>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-slate-50 border border-rose-100 shadow-md">
            <img
              src={product.images[activeImgIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImgIdx === idx ? 'border-rose-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
              <span>{product.brand}</span>
              <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">
                Age: {product.ageGroups.join(', ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">{product.reviewCount} Verified Parent Reviews</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Baby Safe
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              {siteSettings.currencySymbol}{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                {siteSettings.currencySymbol}{product.originalPrice}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Available Color: <span className="text-rose-600">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColor === col.name ? 'border-rose-600 scale-110 shadow-md' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Select Size: <span className="text-rose-600">{selectedSize}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-slate-600 font-bold">-</button>
              <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-slate-600 font-bold">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm"
            >
              <ShoppingBag className="w-5 h-5" /> Add To Shopping Bag
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Delivery & Guarantees */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode for Delivery"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
              <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">Check</button>
            </form>
            {pincodeStatus && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl font-medium">
                {pincodeStatus}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" /> Free Express Shipping &gt; ₹999
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" /> Easy 15-Day Free Pickup Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fabric Specifications & Customer Reviews Section */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 font-serif mb-2">Fabric Composition & Safety Standards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{product.fabricDetails}</p>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 font-serif mb-2">Washing & Care Instructions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{product.careInstructions}</p>
        </div>

        {/* Reviews Section */}
        <div className="pt-6 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 font-serif flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600" /> Customer Reviews ({productReviews.length})
            </h3>
          </div>

          {/* Submit Review Form */}
          <div className="bg-white p-4 rounded-2xl border border-rose-100 space-y-3">
            <h4 className="font-bold text-xs text-slate-900">Write a Review for this outfit</h4>
            {submittedReview ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold">
                Thank you! Your review has been submitted and will be published shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (Parent Name)"
                    value={reviewAuthor}
                    onChange={e => setReviewAuthor(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                  <select
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-bold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Good)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Review Headline (e.g. Super soft fabric!)"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Tell other parents about the fit, comfort and washing experience..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-rose-700 transition-colors"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>

          {/* List of Approved Reviews */}
          <div className="space-y-4">
            {productReviews.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{r.customerName}</span>
                  <div className="flex text-amber-500 text-xs">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
                <p className="font-bold text-xs text-slate-800">{r.title}</p>
                <p className="text-xs text-slate-600">{r.comment}</p>
                {r.adminReply && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-[11px] text-rose-900 border border-rose-100 font-medium">
                    <strong>Official Reply:</strong> {r.adminReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-black text-slate-900 font-serif">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
