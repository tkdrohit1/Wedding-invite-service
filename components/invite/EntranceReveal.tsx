'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Heart, Play, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EntranceType, ThemeDefinition } from '@/lib/types';

interface EntranceRevealProps {
  type: EntranceType;
  theme: ThemeDefinition;
  groomName: string;
  brideName: string;
  guestName?: string;
  onOpen: () => void;
}

export function EntranceReveal({
  type,
  theme,
  groomName,
  brideName,
  guestName,
  onOpen,
}: EntranceRevealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const groomFirst = groomName.split(' ')[0];
  const brideFirst = brideName.split(' ')[0];
  const coupleMonogram = `${groomFirst.charAt(0)} & ${brideFirst.charAt(0)}`;

  const handleOpen = () => {
    if (isAnimating || isOpen) return;
    setIsAnimating(true);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme.primaryColor, theme.accentColor, '#FFFFFF', '#FFD700'],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 1100);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden"
          style={{ background: theme.bgGradient }}
        >
          {/* Subtle background ambient lights */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-25 animate-pulse"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>

          {/* ============================================================ */}
          {/* 1. PALACE GATES STYLE (Realistic 3D Double Carved Doors)     */}
          {/* ============================================================ */}
          {type === 'palace_gates' && (
            <div className="relative w-full max-w-md aspect-[3/4] flex flex-col items-center justify-between rounded-3xl overflow-hidden border-2 border-amber-500/40 p-6 shadow-2xl backdrop-blur-md bg-stone-950/90 text-center [perspective:1200px]">
              {/* Top Theme Badge */}
              <div className="z-20 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-400/40 bg-black/80 text-[11px] uppercase font-bold tracking-widest text-amber-300 shadow">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme: {theme.name}</span>
              </div>

              {/* 3D Animated Gates Container */}
              <div className="relative w-full flex-1 my-4 flex overflow-hidden rounded-2xl border-2 border-amber-700/60 shadow-2xl [transform-style:preserve-3d]">
                {/* Left Gate Panel */}
                <motion.div
                  animate={isAnimating ? { rotateY: -110, opacity: 0.1 } : { rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-1/2 h-full bg-gradient-to-r from-[#2c180a] via-[#3d2411] to-[#1e1005] border-r border-amber-500/40 p-3 flex flex-col items-center justify-center relative [transform-origin:left_center] shadow-2xl"
                >
                  {/* Brass Studs */}
                  <div className="absolute inset-2 border border-amber-500/30 rounded-lg flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                    </div>
                  </div>
                  {/* Lion-Head Door Ring */}
                  <div className="w-10 h-10 rounded-full border border-amber-400/60 bg-amber-950/60 flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-amber-300" />
                  </div>
                </motion.div>

                {/* Right Gate Panel */}
                <motion.div
                  animate={isAnimating ? { rotateY: 110, opacity: 0.1 } : { rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-1/2 h-full bg-gradient-to-l from-[#2c180a] via-[#3d2411] to-[#1e1005] border-l border-amber-500/40 p-3 flex flex-col items-center justify-center relative [transform-origin:right_center] shadow-2xl"
                >
                  <div className="absolute inset-2 border border-amber-500/30 rounded-lg flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow" />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-amber-400/60 bg-amber-950/60 flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-amber-300" />
                  </div>
                </motion.div>

                {/* Golden Light Beam Burst when opening */}
                {isAnimating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-amber-400/80 via-yellow-200/90 to-transparent flex items-center justify-center"
                  >
                    <Sparkles className="w-16 h-16 text-amber-900 animate-spin" />
                  </motion.div>
                )}
              </div>

              {/* Couple Name & Trigger */}
              <div className="z-20 w-full">
                {guestName && (
                  <div className="mb-1 text-[11px] uppercase tracking-widest text-amber-200/90 font-medium">
                    Cordially Invited: {guestName}
                  </div>
                )}
                <h1
                  className="text-3xl font-serif font-bold tracking-wide mb-3"
                  style={{ color: theme.primaryColor }}
                >
                  {groomFirst} & {brideFirst}
                </h1>

                <button
                  onClick={handleOpen}
                  disabled={isAnimating}
                  className="w-full py-3 rounded-full font-serif font-bold tracking-wider text-xs uppercase transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#000',
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnimating ? 'Entering Royal Palace...' : 'Open Royal Gates'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. REALISTIC ENVELOPE WITH 3D CRACKING WAX SEAL              */}
          {/* ============================================================ */}
          {type === 'envelope' && (
            <div className="relative w-full max-w-md aspect-[4/3] flex flex-col items-center justify-between rounded-3xl border border-amber-400/30 p-6 shadow-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black backdrop-blur-xl text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-400/30 bg-black/60 text-[10px] uppercase font-bold tracking-widest text-amber-300">
                <Mail className="w-3 h-3 text-amber-400" />
                <span>Theme: {theme.name}</span>
              </div>

              {/* Envelope Body */}
              <div className="relative w-full max-w-xs h-36 bg-[#211d1a] border-2 border-amber-600/50 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                {/* Flap Triangles */}
                <div
                  className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#2e2723] to-[#181513] border-b border-amber-500/40"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />

                {/* 3D Wax Seal Stamp in Center */}
                <motion.button
                  onClick={handleOpen}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isAnimating ? { rotate: 20, scale: 0.8, opacity: 0.2 } : {}}
                  className="relative z-10 w-16 h-16 rounded-full border-2 border-red-400 shadow-2xl flex flex-col items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: '#8B0000',
                    boxShadow: '0 8px 25px rgba(139,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.4)',
                  }}
                >
                  <span className="text-[10px] font-serif font-black tracking-tighter text-amber-200">
                    {coupleMonogram}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-amber-300/80">
                    SEAL
                  </span>
                </motion.button>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
                  Royal Invitation To Celebrate
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-serif font-bold mb-3"
                  style={{ color: theme.primaryColor }}
                >
                  {groomFirst} & {brideFirst}
                </h2>

                <button
                  onClick={handleOpen}
                  disabled={isAnimating}
                  className="px-6 py-2.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 mx-auto"
                >
                  <span>{isAnimating ? 'Opening Invitation...' : 'Break Wax Seal & Read'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. ROYAL THEATER VELVET CURTAINS                             */}
          {/* ============================================================ */}
          {type === 'velvet_curtain' && (
            <div className="relative w-full max-w-md aspect-[3/4] flex flex-col items-center justify-between rounded-3xl overflow-hidden border border-amber-500/30 p-6 shadow-2xl bg-zinc-950/95 text-center">
              <div className="z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/40 bg-black/80 text-[11px] uppercase font-bold tracking-widest text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme: {theme.name}</span>
              </div>

              {/* Velvet Drapes */}
              <div className="relative w-full flex-1 my-3 rounded-2xl overflow-hidden border border-amber-500/30 flex">
                {/* Left Curtain */}
                <motion.div
                  animate={isAnimating ? { x: '-100%' } : { x: 0 }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                  className="w-1/2 h-full bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-r-2 border-amber-400/60 shadow-2xl relative flex items-center justify-end pr-2"
                >
                  <div className="w-2 h-12 bg-amber-400 rounded-full shadow" />
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                  animate={isAnimating ? { x: '100%' } : { x: 0 }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                  className="w-1/2 h-full bg-gradient-to-l from-red-950 via-red-900 to-red-950 border-l-2 border-amber-400/60 shadow-2xl relative flex items-center justify-start pl-2"
                >
                  <div className="w-2 h-12 bg-amber-400 rounded-full shadow" />
                </motion.div>
              </div>

              <div className="z-20 w-full">
                <h1
                  className="text-3xl font-serif font-bold tracking-wide mb-3"
                  style={{ color: theme.primaryColor }}
                >
                  {groomFirst} & {brideFirst}
                </h1>

                <button
                  onClick={handleOpen}
                  disabled={isAnimating}
                  className="w-full py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-xl transition-all"
                >
                  {isAnimating ? 'Parting Royal Curtains...' : 'Part Velvet Curtains'}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. CINEMATIC FILM PLAY                                       */}
          {/* ============================================================ */}
          {type === 'film_play' && (
            <div className="relative w-full max-w-md aspect-[3/4] flex flex-col items-center justify-between rounded-3xl overflow-hidden border border-amber-500/30 p-6 shadow-2xl bg-black/90 backdrop-blur-xl text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/40 bg-black/80 text-[11px] uppercase font-bold tracking-widest text-amber-300">
                <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Theme: {theme.name}</span>
              </div>

              {/* Widescreen Letterbox Screen */}
              <div className="relative w-full flex-1 my-4 rounded-xl border border-white/20 bg-zinc-950 overflow-hidden flex flex-col items-center justify-center p-4">
                <motion.button
                  onClick={handleOpen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full border-2 border-amber-400 bg-amber-400/20 text-amber-300 flex items-center justify-center shadow-2xl pl-1"
                >
                  <Play className="w-8 h-8 fill-current" />
                </motion.button>
                <span className="text-[11px] uppercase tracking-widest text-zinc-300 mt-4 font-semibold">
                  Tap To Play Celebration Film
                </span>
              </div>

              <div className="w-full">
                <h1
                  className="text-3xl font-serif font-bold tracking-wide mb-3"
                  style={{ color: theme.primaryColor }}
                >
                  {groomFirst} & {brideFirst}
                </h1>
                <button
                  onClick={handleOpen}
                  disabled={isAnimating}
                  className="w-full py-3 rounded-full font-serif font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-xl"
                >
                  {isAnimating ? 'Starting Celebration...' : 'Play Invitation Trailer'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
