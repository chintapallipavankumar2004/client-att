import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Truck,
  Heart,
  LayoutDashboard
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, setCurrentView, setIsTrackOrderOpen, setIsAdminOpen } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t-4 border-rose-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* VIP Newsletter Top Banner */}
        <div className="bg-gradient-to-r from-rose-900/60 via-purple-900/60 to-slate-900 p-8 rounded-3xl border border-rose-500/20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> VIP Tiny Trends Club
            </span>
            <h3 className="text-2xl font-black text-white font-serif">
              Get ₹500 OFF On Your First Order
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Subscribe to receive secret flash sales, festive coupon codes & parenting fashion guides.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-rose-400 w-full sm:w-80"
            />
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition-all shadow-lg shrink-0"
            >
              Subscribe Now
            </button>
          </form>
          {newsletterSuccess && (
            <p className="text-xs text-emerald-400 font-bold">🎉 Welcome! Use code WELCOME500 at checkout!</p>
          )}
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black text-white font-serif">
                Akshvik <span className="text-rose-500">Tiny Trends</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's premier modern kids fashion destination. Crafting 100% GOTS certified organic, skin-safe, hypoallergenic apparel for babies & toddlers.
            </p>

            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                {siteSettings.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                {siteSettings.supportPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                {siteSettings.supportEmail}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Shopping</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-rose-400">Home</button></li>
              <li><button onClick={() => setCurrentView('shop')} className="hover:text-rose-400">All Collections</button></li>
              <li><button onClick={() => setCurrentView('shop')} className="hover:text-rose-400">New Arrivals</button></li>
              <li><button onClick={() => setCurrentView('shop')} className="hover:text-rose-400">Festive Ethnic Wear</button></li>
              <li><button onClick={() => setCurrentView('shop')} className="hover:text-rose-400">Organic Baby Onesies</button></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Help & Support</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setIsTrackOrderOpen(true)} className="hover:text-rose-400 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Track Order Status</button></li>
              <li><button onClick={() => setCurrentView('about')} className="hover:text-rose-400">About Our Brand</button></li>
              <li><button onClick={() => setCurrentView('blog')} className="hover:text-rose-400">Parenting Blog</button></li>
              <li><button onClick={() => setIsAdminOpen(true)} className="text-amber-400 font-bold hover:underline flex items-center gap-1"><LayoutDashboard className="w-3.5 h-3.5" /> Admin Control CMS</button></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Connect With Us</p>
            <p className="text-slate-400 text-xs">Join our community of 50,000+ parents on social media.</p>
            <div className="flex gap-3 pt-2">
              <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Akshvik Tiny Trends. All Rights Reserved. Designed with ❤️ for Kids.</p>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-mono">
            <span>🔒 256-Bit SSL Secured</span>
            <span>•</span>
            <span>🚚 Express Delhivery Partner</span>
            <span>•</span>
            <span>💳 UPI & Card Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
