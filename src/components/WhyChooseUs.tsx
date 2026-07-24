import React from 'react';
import { ShieldCheck, HeartHandshake, Truck, RotateCcw, Sparkles, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: '100% Baby Safe & Organic',
      desc: 'OEKO-TEX certified chemical-free dyes and hypoallergenic bamboo fabrics gentlest on infant skin.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: 'Crafted Heritage Luxury',
      desc: 'Tailored with non-irritating flat seam construction and tagless neck labels for zero scratchiness.'
    },
    {
      icon: <Truck className="w-6 h-6 text-rose-600" />,
      title: 'Express PAN-India Delivery',
      desc: 'Free express shipping on all orders over ₹999 with real-time SMS & WhatsApp tracking updates.'
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-sky-600" />,
      title: '15-Day Hassle-Free Returns',
      desc: 'Size mismatch or change of mind? Enjoy instant doorstep pickup and hassle-free refunds.'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Uncompromising Quality
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif mt-1">
            Why Parents Choose Akshvik
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-rose-50/40 border border-rose-100 hover:border-rose-300 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-serif">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
