import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    siteSettings,
    setCurrentView,
    addOrder,
    setIsTrackOrderOpen
  } = useStore();

  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');

  // Customer Form State
  const [formData, setFormData] = useState({
    name: 'Priyanka Sharma',
    email: 'priyanka.s@gmail.com',
    phone: '+91 98765 43210',
    street: 'Flat 402, Sunshine Heights, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    zip: '500033',
    country: 'India',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'COD' | 'NetBanking'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          }
        },
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          color: item.color,
          size: item.size,
          ageGroup: item.ageGroup,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: cartSubtotal,
        discount: cartSubtotal - cartTotal,
        shipping: cartSubtotal >= siteSettings.freeShippingThreshold ? 0 : siteSettings.shippingFee,
        tax: Math.round((cartTotal * siteSettings.taxPercent) / 100),
        total: cartTotal,
        paymentMethod: formData.paymentMethod
      };

      const orderData = addOrder(payload);
      setCompletedOrder(orderData);
      clearCart();
      setStep('confirmation');
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-3xl shadow-xl border border-rose-100">
        <h2 className="text-xl font-bold text-slate-800">Your bag is empty</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 bg-rose-600 text-white font-bold text-xs py-2.5 px-6 rounded-full"
        >
          Return To Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header Steps */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-rose-200 tracking-wider">
              {step === 'confirmation' ? 'Success' : 'Checkout'}
            </span>
            <h1 className="text-2xl font-black font-serif">
              {step === 'confirmation' ? '🎉 Order Placed Successfully!' : 'Complete Your Order'}
            </h1>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Navigation Indicator */}
        {step !== 'confirmation' && (
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
            <div className={`flex-1 p-3 text-center border-r border-slate-100 ${step === 'address' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : ''}`}>
              1. Delivery Address
            </div>
            <div className={`flex-1 p-3 text-center ${step === 'payment' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : ''}`}>
              2. Payment & Review
            </div>
          </div>
        )}

        {/* STEP 1: Address Form */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Parent / Shipping Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode / Zip</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={e => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House No.</label>
              <textarea
                required
                rows={2}
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value={formData.country}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-8 rounded-2xl shadow-lg flex items-center gap-2"
              >
                Continue To Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Method */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Methods Options */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Select Payment Method</h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'UPI' ? 'border-rose-600 bg-rose-50/50 shadow-md' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-rose-600 mb-2" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">UPI / QR Code</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'Card' ? 'border-rose-600 bg-rose-50/50 shadow-md' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-rose-600 mb-2" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Credit / Debit Card</p>
                      <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'COD' ? 'border-rose-600 bg-rose-50/50 shadow-md' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <DollarSign className="w-6 h-6 text-rose-600 mb-2" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Cash On Delivery</p>
                      <p className="text-[10px] text-slate-500">Pay cash upon doorstep drop</p>
                    </div>
                  </button>
                </div>

                {/* Simulated Payment Box */}
                {formData.paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">Scan QR Code or pay to UPI ID:</p>
                    <div className="inline-block bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                      <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-mono">
                        [AKSHVIK UPI QR]
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-rose-600">akshviktinytrends@icici</p>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">Order Summary</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="truncate max-w-[140px]">{item.quantity}x {item.name}</span>
                      <span className="font-bold">{siteSettings.currencySymbol}{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{siteSettings.currencySymbol}{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
                    <span>Amount Payable</span>
                    <span className="text-rose-600">{siteSettings.currencySymbol}{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl shadow-md text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Payment...' : `Confirm & Pay ${siteSettings.currencySymbol}${cartTotal}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation Invoice */}
        {step === 'confirmation' && completedOrder && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-serif">
                Thank You, {completedOrder.customer.name}!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your order <strong className="text-rose-600 font-mono">{completedOrder.orderNumber}</strong> has been received and is being packed.
              </p>
            </div>

            {/* Invoice Card Box */}
            <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-200 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Tracking Number</p>
                  <p className="text-sm font-black text-slate-900 font-mono">{completedOrder.trackingNumber}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-rose-600"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p><strong>Shipping To:</strong> {completedOrder.customer.address.street}, {completedOrder.customer.address.city}, {completedOrder.customer.address.state} - {completedOrder.customer.address.zip}</p>
                <p><strong>Payment Method:</strong> {completedOrder.paymentMethod} ({completedOrder.paymentStatus})</p>
                <p><strong>Estimated Delivery:</strong> Within 2-3 business days via Delhivery Express</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsTrackOrderOpen(true);
                  setCurrentView('home');
                }}
                className="bg-slate-900 text-white font-bold text-xs py-3 px-6 rounded-2xl hover:bg-slate-800 transition-colors"
              >
                🚚 Track Order Status
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="bg-rose-600 text-white font-bold text-xs py-3 px-6 rounded-2xl hover:bg-rose-700 transition-colors"
              >
                Back To Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
