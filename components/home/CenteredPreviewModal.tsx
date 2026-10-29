'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronLeft, ChevronRight, Lock, ExternalLink, ShieldCheck } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';
import { WEDDING_THEMES } from '@/config/themes';

interface CenteredPreviewModalProps {
  theme: ThemeDefinition | null;
  onClose: () => void;
  onSelectTheme: (theme: ThemeDefinition) => void;
}

export function CenteredPreviewModal({
  theme,
  onClose,
  onSelectTheme,
}: CenteredPreviewModalProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition | null>(theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentTheme(theme);
    setIsLoading(true);
  }, [theme]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!currentTheme) return null;

  // Find index for Next / Previous navigation
  const currentIndex = WEDDING_THEMES.findIndex((t) => t.id === currentTheme.id);
  const prevTheme = currentIndex > 0 ? WEDDING_THEMES[currentIndex - 1] : WEDDING_THEMES[WEDDING_THEMES.length - 1];
  const nextTheme = currentIndex < WEDDING_THEMES.length - 1 ? WEDDING_THEMES[currentIndex + 1] : WEDDING_THEMES[0];

  const handlePrev = () => {
    setIsLoading(true);
    setCurrentTheme(prevTheme);
  };

  const handleNext = () => {
    setIsLoading(true);
    setCurrentTheme(nextTheme);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Navigation Arrows for Desktop */}
        <button
          onClick={handlePrev}
          title={`Previous: ${prevTheme.name}`}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-zinc-900/80 hover:bg-white/10 text-white items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          title={`Next: ${nextTheme.name}`}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-zinc-900/80 hover:bg-white/10 text-white items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Modal Content Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative flex flex-col items-center max-w-sm sm:max-w-md w-full h-[90vh] max-h-[820px]"
        >
          {/* Top Bar with Theme Pill & Close Button */}
          <div className="w-full flex items-center justify-between gap-2 mb-3 px-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-400 text-black shadow">
                {currentTheme.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 truncate max-w-[140px] sm:max-w-xs">
                {currentTheme.series}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/invite/demo-${currentTheme.id}`}
                target="_blank"
                rel="noreferrer"
                title="Open in new window"
                className="p-1.5 rounded-full border border-white/20 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full border border-white/20 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smartphone Frame in Center of Screen */}
          <div
            className="relative w-full flex-1 rounded-[2.8rem] sm:rounded-[3rem] p-2.5 sm:p-3 border-4 border-amber-500/40 bg-neutral-950 shadow-[0_0_80px_rgba(212,175,55,0.25)] flex flex-col overflow-hidden"
            style={{
              borderColor: currentTheme.primaryColor,
            }}
          >
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-[2.5rem]">
                <div
                  className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-3"
                  style={{ borderColor: currentTheme.primaryColor, borderTopColor: 'transparent' }}
                />
                <span className="text-xs uppercase tracking-widest font-serif font-bold text-amber-300">
                  Loading {currentTheme.name}...
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">
                  Rendering Full Interactive Preview
                </span>
              </div>
            )}

            {/* Embedded Live Interactive Invitation */}
            <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-black relative">
              <iframe
                key={currentTheme.id}
                src={`/invite/demo-${currentTheme.id}`}
                title={`Interactive Preview of ${currentTheme.name}`}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="w-full mt-3 flex items-center gap-2">
            <button
              onClick={() => onSelectTheme(currentTheme)}
              className="flex-1 py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 text-black"
              style={{
                backgroundColor: currentTheme.primaryColor,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Select {currentTheme.name} & Customize</span>
            </button>

            <button
              onClick={handleNext}
              className="md:hidden px-4 py-3 rounded-full border border-white/20 bg-zinc-900 text-xs font-semibold uppercase text-zinc-300 hover:text-white"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
