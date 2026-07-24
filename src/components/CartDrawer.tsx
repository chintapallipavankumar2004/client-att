import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Gift,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    siteSettings,
    setCurrentView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, siteSettings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / siteSettings.freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-rose-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-black text-slate-900 font-serif">
                  Your Shopping Bag
                </h2>
                <span className="bg-rose-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-rose-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 px-6 text-xs font-semibold">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {freeShippingNeeded === 0
                    ? '🎉 You unlocked FREE Express Shipping!'
                    : `Add ${siteSettings.currencySymbol}${freeShippingNeeded} more for FREE Express Shipping`}
                </span>
                <span className="font-bold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Your bag is currently empty</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore our festive wear, organic onesies and adorable dresses for your little ones.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentView('shop');
                    }}
                    className="mt-2 bg-rose-600 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 rounded-2xl border border-rose-100 bg-slate-50/50 hover:bg-white hover:border-rose-200 transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover rounded-xl border border-slate-100"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Size: <strong className="text-slate-700">{item.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-slate-700">{item.color}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          {siteSettings.currencySymbol}{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-slate-100 bg-white space-y-3">
                {/* Coupon Code Entry */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Code <strong>{appliedCoupon.code}</strong> Applied!</span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-700 hover:underline font-bold text-[10px]">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code (e.g. TINY20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500 uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMsg && (
                    <p className={`text-[10px] mt-1 font-medium ${couponMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{siteSettings.currencySymbol}{cartSubtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-{siteSettings.currencySymbol}{cartSubtotal - cartTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-900">
                      {cartSubtotal >= siteSettings.freeShippingThreshold ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `${siteSettings.currencySymbol}${siteSettings.shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>Grand Total</span>
                    <span className="text-rose-600">{siteSettings.currencySymbol}{cartTotal}</span>
                  </div>
                </div>

                {/* Checkout CTA Button */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('checkout');
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center gap-2 transition-all transform hover:scale-102 text-sm cursor-pointer"
                >
                  Proceed To Secure Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
