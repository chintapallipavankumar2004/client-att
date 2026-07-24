import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

export const HeroSlider: React.FC = () => {
  const { banners, setCurrentView, setActiveCategoryFilter } = useStore();
  const activeBanners = banners.filter(b => b.active).sort((a, b) => a.priority - b.priority);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleCtaClick = (link: string) => {
    if (link.includes('category=')) {
      const cat = link.split('category=')[1];
      setActiveCategoryFilter(cat);
      setCurrentView('shop');
    } else {
      setCurrentView('shop');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: currentBanner.bgColor || '#1e1b4b' }}
        >
          {/* Desktop & Mobile Background Images */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(min-width: 768px)" srcSet={currentBanner.desktopImage} />
              <img
                src={currentBanner.mobileImage || currentBanner.desktopImage}
                alt={currentBanner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-90 contrast-105 transform group-hover:scale-105 transition-transform duration-1000"
              />
            </picture>

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30" />
          </div>

          {/* Banner Text Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full text-left py-12">
            <div className="max-w-2xl space-y-4">
              {currentBanner.badgeText && (
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {currentBanner.badgeText}
                </motion.span>
              )}

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-serif leading-tight drop-shadow-md"
              >
                {currentBanner.title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-lg text-slate-200 font-medium max-w-xl line-clamp-2 drop-shadow-sm"
              >
                {currentBanner.subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <button
                  onClick={() => handleCtaClick(currentBanner.buttonLink)}
                  className="bg-white hover:bg-rose-500 text-slate-900 hover:text-white font-black text-sm sm:text-base px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 hover:shadow-rose-500/30 cursor-pointer"
                >
                  {currentBanner.buttonText || 'Explore Collection'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Left Arrow */}
      {activeBanners.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Slider Right Arrow */}
      {activeBanners.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Slider Indicators & Play/Pause Control */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            {activeBanners.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-rose-500' : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
