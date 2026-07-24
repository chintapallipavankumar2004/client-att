import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialCarousel: React.FC = () => {
  const { reviews } = useStore();
  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  return (
    <section className="py-12 bg-gradient-to-b from-rose-50/50 via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Loved By 50,000+ Happy Parents
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif mt-1">
            Real Reviews From Real Moms & Dads
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-rose-100 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-rose-200 absolute top-4 right-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={rev.customerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.customerName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-rose-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {rev.customerName}
                    {rev.verifiedPurchase && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" title="Verified Buyer" />
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">Verified Buyer • {rev.productName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
