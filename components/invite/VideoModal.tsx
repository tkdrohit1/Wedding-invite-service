'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Film, Lock } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  coupleTitle: string;
  theme: ThemeDefinition;
  isLocked?: boolean;
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  coupleTitle,
  theme,
  isLocked = false,
}: VideoModalProps) {
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `✨ You are cordially invited to celebrate ${coupleTitle}! Watch our wedding invite video here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm rounded-3xl p-4 sm:p-6 border border-amber-500/30 shadow-2xl flex flex-col items-center"
            style={{ backgroundColor: '#0d0d11' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-serif font-bold tracking-widest text-amber-200">
                1080×1920 Mobile Story Video
              </span>
              {isLocked && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Preview</span>
                </span>
              )}
            </div>

            {/* Video Player Frame */}
            <div
              className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative mb-4 select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                
                className="w-full h-full object-contain"
              />

              {/* Watermark in preview/locked mode */}
              {isLocked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="transform -rotate-45 text-white/20 font-black text-2xl tracking-widest uppercase border-2 border-dashed border-white/20 px-6 py-2 select-none">
                    Preview Sample Only
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {isLocked ? (
              <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-300 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Download Disabled in Preview Mode</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  High-res 1080×1920 WhatsApp MP4 video download will be unlocked upon admin confirmation.
                </p>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <a
                  href={videoUrl}
                  download={`${coupleTitle}-wedding-invite.mp4`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-lg"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#000',
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Save MP4</span>
                </a>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
