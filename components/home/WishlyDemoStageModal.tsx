'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  ExternalLink,
  Smartphone,
  Maximize2,
  Heart,
  Check,
  MessageCircle,
} from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';
import { WEDDING_THEMES } from '@/config/themes';
import { getDemoInviteForTheme } from '@/lib/demoData';

interface WishlyDemoStageModalProps {
  theme: ThemeDefinition | null;
  onClose: () => void;
  onSelectTheme: (theme: ThemeDefinition) => void;
}

export function WishlyDemoStageModal({
  theme,
  onClose,
  onSelectTheme,
}: WishlyDemoStageModalProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition | null>(theme);
  const [viewMode, setViewMode] = useState<'stage' | 'mobile'>('stage');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const demoInvite = getDemoInviteForTheme(currentTheme);
  const groomFirst = demoInvite.couple.groomName.split(' ')[0];
  const brideFirst = demoInvite.couple.brideName.split(' ')[0];

  const getRevealLabel = () => {
    switch (currentTheme.entranceReveal) {
      case 'palace_gates':
        return 'Palace Door Reveal';
      case 'envelope':
        return 'Wax-Sealed Envelope Reveal';
      case 'velvet_curtain':
        return 'Velvet Curtain Reveal';
      case 'film_play':
        return 'Signature Film Animation';
      default:
        return 'Interactive Reveal';
    }
  };

  // Find index for Next / Previous navigation
  const currentIndex = WEDDING_THEMES.findIndex((t) => t.id === currentTheme.id);
  const prevTheme =
    currentIndex > 0
      ? WEDDING_THEMES[currentIndex - 1]
      : WEDDING_THEMES[WEDDING_THEMES.length - 1];
  const nextTheme =
    currentIndex < WEDDING_THEMES.length - 1
      ? WEDDING_THEMES[currentIndex + 1]
      : WEDDING_THEMES[0];

  const handlePrev = () => {
    setIsLoading(true);
    setCurrentTheme(prevTheme);
  };

  const handleNext = () => {
    setIsLoading(true);
    setCurrentTheme(nextTheme);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/invite/demo-${currentTheme.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-3 md:p-6 overflow-y-auto select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[100] rounded-full p-2.5 text-white/80 hover:text-white transition hover:bg-white/20"
          aria-label="Close demo"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Previous Theme Desktop Button */}
        <button
          onClick={handlePrev}
          title={`Previous: ${prevTheme.name}`}
          className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-zinc-900/90 hover:bg-white/10 text-white items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 z-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Theme Desktop Button */}
        <button
          onClick={handleNext}
          title={`Next: ${nextTheme.name}`}
          className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-zinc-900/90 hover:bg-white/10 text-white items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 z-30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Wishly Top Header Container */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center md:max-w-4xl lg:max-w-5xl">
          <div className="mb-3 flex flex-col items-center text-center text-white md:mb-5">
            <h3 className="text-xl font-serif font-bold md:text-3xl tracking-tight text-white mb-1">
              {currentTheme.name}
            </h3>

            <p className="mb-3 text-xs md:text-sm text-zinc-400">
              {groomFirst} & {brideFirst} •{' '}
              <span className="text-amber-300 font-medium">{getRevealLabel()}</span>
            </p>

            {/* Actions Bar (Wishly "I want this one" + Mode Switcher + Share) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => onSelectTheme(currentTheme)}
                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black shadow-xl transition-all transform hover:scale-105 active:scale-95 hover:brightness-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>I want this one</span>
              </button>

              {/* Direct WhatsApp Enquiry */}
              {(() => {
                const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE || '919876543210';
                const waText = `Hi EternalVows Studio! 💌\n\nI love the "${currentTheme.name}" wedding invitation design on your website.\nCan you share details on pricing and customizing it?`;
                const waUrl = `https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;
                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] hover:bg-[#20bd5a] px-5 py-2 text-sm font-semibold text-black shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    title="Enquire on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Ask on WhatsApp</span>
                  </a>
                );
              })()}

              {/* Viewport Mode Toggle */}
              <div className="flex items-center rounded-full bg-white/10 border border-white/15 p-0.5 text-xs text-zinc-300">
                <button
                  onClick={() => setViewMode('stage')}
                  className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition ${
                    viewMode === 'stage'
                      ? 'bg-amber-400 text-black font-semibold shadow'
                      : 'hover:text-white'
                  }`}
                  title="Immersive Stage View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stage View</span>
                </button>

                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition ${
                    viewMode === 'mobile'
                      ? 'bg-amber-400 text-black font-semibold shadow'
                      : 'hover:text-white'
                  }`}
                  title="Phone Preview View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Phone Frame</span>
                </button>
              </div>

              {/* Share Demo Button */}
              <button
                onClick={handleShare}
                className="rounded-full border border-white/20 bg-white/5 hover:bg-white/15 px-3.5 py-2 text-xs font-medium text-white transition flex items-center gap-1.5 shadow"
                title="Copy Demo Link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              {/* External Fullscreen Link */}
              <a
                href={`/invite/demo-${currentTheme.id}`}
                target="_blank"
                rel="noreferrer"
                title="Open in standalone tab"
                className="rounded-full border border-white/20 bg-white/5 hover:bg-white/15 p-2 text-white transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Wishly Grand Stage Canvas */}
          <div
            className={`w-full mx-auto overflow-hidden shadow-2xl ring-1 ring-white/20 relative transition-all duration-300 ${
              viewMode === 'stage'
                ? 'h-[min(620px,74dvh)] md:h-[min(780px,80dvh)] rounded-2xl bg-[#0a0908]'
                : 'max-w-sm sm:max-w-md h-[min(680px,82dvh)] rounded-[2.8rem] p-2.5 sm:p-3 border-4 border-amber-500/40 bg-neutral-950'
            }`}
            style={{
              borderColor: viewMode === 'mobile' ? currentTheme.primaryColor : undefined,
            }}
          >
            {/* If Mobile View: Dynamic Island Notch */}
            {viewMode === 'mobile' && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700 mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-2xl">
                <div
                  className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-3"
                  style={{
                    borderColor: currentTheme.primaryColor,
                    borderTopColor: 'transparent',
                  }}
                />
                <span className="text-xs uppercase tracking-widest font-serif font-bold text-amber-300">
                  Loading {currentTheme.name}...
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">
                  Rendering Live Interactive Reveal
                </span>
              </div>
            )}

            {/* Embedded Live Interactive Invitation Experience */}
            <div
              className={`w-full h-full overflow-hidden relative ${
                viewMode === 'mobile' ? 'rounded-[2.3rem]' : 'rounded-xl'
              }`}
            >
              <iframe
                key={`${currentTheme.id}-${viewMode}`}
                src={`/invite/demo-${currentTheme.id}`}
                title={`Interactive Demo of ${currentTheme.name}`}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Bottom Bar Mobile Next/Prev buttons */}
          <div className="flex lg:hidden items-center justify-between gap-3 mt-3 w-full px-2">
            <button
              onClick={handlePrev}
              className="flex-1 py-2 rounded-full border border-white/20 bg-white/5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-2 rounded-full border border-white/20 bg-white/5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Next →
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
