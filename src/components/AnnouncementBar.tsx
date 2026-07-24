import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcements } = useStore();
  const ann = announcements[0];

  if (!ann || !ann.active) return null;

  return (
    <div
      style={{ backgroundColor: ann.bgColor || '#e11d48', color: ann.textColor || '#ffffff' }}
      className="py-2 px-4 text-xs font-medium font-serif overflow-hidden relative border-b border-white/10 shadow-inner"
    >
      <div className="flex items-center justify-center gap-2 whitespace-nowrap animate-marquee">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span className="font-bold tracking-wide">{ann.text}</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      </div>
    </div>
  );
};
