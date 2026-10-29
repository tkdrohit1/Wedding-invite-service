'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, ArrowRight, Eye, Flame, Lock } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';
import { WEDDING_THEMES } from '@/config/themes';
import { getDemoInviteForTheme } from '@/lib/demoData';
import {
  RoyalJharokhaCrown,
  RoyalElephantProcession,
  TempleGopuramHeader,
  MangoLeafThoranam,
  KuthuVilakkuLamp,
  SouthIndianKolam,
  MughalMehrabArch,
  HangingMoroccanLantern,
  PichwaiSacredCow,
  PichwaiLotusPond,
  BotanicalFloralBower,
  EditorialMonogramHeader,
  FolkArtHeaderBand,
} from '@/components/invite/Motifs';

interface HeroShowcaseProps {
  onOpenPreview: (theme: ThemeDefinition) => void;
  onCustomizeClick: () => void;
}

export function HeroShowcase({
  onOpenPreview,
  onCustomizeClick,
}: HeroShowcaseProps) {
  // Handpicked representative themes for top screen ribbon
  const showcaseThemes = [
    WEDDING_THEMES.find((t) => t.id === 'shubh-aarambh') || WEDDING_THEMES[0],
    WEDDING_THEMES.find((t) => t.id === 'royal-jaipur') || WEDDING_THEMES[1],
    WEDDING_THEMES.find((t) => t.id === 'divine-oonjal') || WEDDING_THEMES[2],
    WEDDING_THEMES.find((t) => t.id === 'nikah-noor') || WEDDING_THEMES[3],
    WEDDING_THEMES.find((t) => t.id === 'udaipur-pichwai') || WEDDING_THEMES[4],
    WEDDING_THEMES.find((t) => t.id === 'anand-karaj') || WEDDING_THEMES[5],
    WEDDING_THEMES.find((t) => t.id === 'zenith-monochrome') || WEDDING_THEMES[6],
    WEDDING_THEMES.find((t) => t.id === 'cathedral-grace') || WEDDING_THEMES[7],
  ];

  const [activeTheme, setActiveTheme] = useState<ThemeDefinition>(showcaseThemes[0]);

  const demo = getDemoInviteForTheme(activeTheme);
  const groomFirst = demo.couple.groomName.split(' ')[0];
  const brideFirst = demo.couple.brideName.split(' ')[0];

  const getArchetype = (t: ThemeDefinition) => {
    const id = t.id.toLowerCase();
    const series = t.series;
    const religion = t.religion || [];

    if (id.includes('pichwai') || id.includes('lotus-lake')) return 'pichwai';
    if (religion.includes('muslim') || id.includes('nikah') || id.includes('noor')) return 'mughal';
    if (series === 'Sacred Temple & South Indian' || religion.includes('hindu_south') || id.includes('oonjal') || id.includes('temple')) return 'temple';
    if (series === 'Floral, Garden & Nature' || religion.includes('christian')) return 'botanical';
    if (series === 'Modern Luxe, Celestial & Editorial') return 'editorial';
    if (series === 'Regional Heritage & Folk Art') return 'folk';
    return 'jharokha';
  };

  const archetype = getArchetype(activeTheme);

  return (
    <section className="relative pt-10 pb-16 px-4 sm:px-6 overflow-hidden border-b border-white/10">
      {/* Background ambient gold lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Top Split Layout: Left Content, Right Phone Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs uppercase tracking-widest font-semibold mb-6 shadow-md">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Digital Wedding Invitations • 70 Handcrafted Themes</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white mb-6 leading-[1.15]">
              Your love story, as an invitation they open.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                Ever after.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 mb-8 font-light leading-relaxed">
              Explore 70 bespoke cultural wedding invitation patterns with matching 1080×1920
              story videos. <strong>Tap any design to open its live interactive sample right in the middle of your screen.</strong>
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onOpenPreview(activeTheme)}
                className="px-8 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#e8c98a] to-[#d4b06a] hover:brightness-110 text-[#1a1105] shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#1a1105]" />
                <span>Watch It Open</span>
              </button>

              <button
                onClick={onCustomizeClick}
                className="px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Customize Your Invitation</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Smartphone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={() => onOpenPreview(activeTheme)}
              className="group relative w-64 sm:w-72 h-[31rem] rounded-[2.8rem] bg-neutral-950 p-2.5 shadow-[0_0_80px_rgba(212,175,55,0.25)] ring-2 ring-amber-400/40 cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:ring-amber-400 select-none"
              style={{ borderColor: activeTheme.primaryColor }}
            >
              {/* Dynamic Island Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700 mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>

              {/* Top Mode Badge inside Phone */}
              <div className="absolute top-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 border border-amber-400/40 text-[9px] uppercase font-bold text-amber-300 shadow">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Full Interactive Live Sample</span>
              </div>

              {/* Inside Screen Canvas */}
              <div
                className="relative w-full h-full rounded-[2.3rem] overflow-hidden p-4 flex flex-col justify-between items-center text-center shadow-inner"
                style={{ background: activeTheme.bgGradient }}
              >
                {/* Background Ambient Glow */}
                <div
                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl opacity-35"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                />

                {/* Top Architectural Motif */}
                <div className="w-full mt-10 scale-90 origin-top">
                  {archetype === 'jharokha' && <RoyalJharokhaCrown color={activeTheme.primaryColor} />}
                  {archetype === 'temple' && (
                    <div className="w-full">
                      <TempleGopuramHeader color={activeTheme.primaryColor} />
                      <MangoLeafThoranam />
                    </div>
                  )}
                  {archetype === 'mughal' && <MughalMehrabArch color={activeTheme.primaryColor} />}
                  {archetype === 'botanical' && <BotanicalFloralBower color={activeTheme.primaryColor} />}
                  {archetype === 'editorial' && (
                    <EditorialMonogramHeader
                      groom={groomFirst}
                      bride={brideFirst}
                      color={activeTheme.primaryColor}
                    />
                  )}
                  {archetype === 'pichwai' && <PichwaiLotusPond color={activeTheme.primaryColor} />}
                </div>

                {/* Framed Couple Portrait */}
                <div className="relative my-auto flex items-center justify-center">
                  {archetype === 'temple' && (
                    <div className="absolute left-1 scale-75 origin-left">
                      <KuthuVilakkuLamp color={activeTheme.primaryColor} />
                    </div>
                  )}
                  {archetype === 'mughal' && (
                    <div className="absolute left-1 top-0 scale-75 origin-top-left">
                      <HangingMoroccanLantern color={activeTheme.primaryColor} />
                    </div>
                  )}
                  {archetype === 'pichwai' && (
                    <div className="absolute left-1 bottom-0 scale-75 origin-bottom-left">
                      <PichwaiSacredCow color={activeTheme.primaryColor} />
                    </div>
                  )}

                  <div
                    className={`relative overflow-hidden border-2 shadow-2xl transition-transform duration-500 group-hover:scale-105 ${
                      archetype === 'jharokha'
                        ? 'w-28 h-36 rounded-t-[3.5rem] rounded-b-xl bg-zinc-900'
                        : archetype === 'temple'
                        ? 'w-28 h-34 rounded-t-[3rem] rounded-b-md bg-[#1a140d]'
                        : archetype === 'mughal'
                        ? 'w-28 h-36 rounded-t-[4rem] rounded-b-lg bg-[#0b1914]'
                        : archetype === 'editorial'
                        ? 'w-32 h-36 rounded-none bg-zinc-900'
                        : 'w-28 h-28 rounded-full bg-zinc-900'
                    }`}
                    style={{ borderColor: activeTheme.primaryColor }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demo.couple.heroPhoto}
                      alt={activeTheme.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {archetype === 'temple' && (
                    <div className="absolute right-1 scale-75 origin-right">
                      <KuthuVilakkuLamp color={activeTheme.primaryColor} />
                    </div>
                  )}
                  {archetype === 'mughal' && (
                    <div className="absolute right-1 top-0 scale-75 origin-top-right">
                      <HangingMoroccanLantern color={activeTheme.primaryColor} />
                    </div>
                  )}
                  {archetype === 'pichwai' && (
                    <div className="absolute right-1 bottom-0 scale-75 origin-bottom-right">
                      <PichwaiSacredCow color={activeTheme.primaryColor} flip />
                    </div>
                  )}
                </div>

                {/* Couple Names */}
                <div className="w-full pb-2">
                  <h3
                    className="text-xl font-serif font-bold tracking-wide"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    {groomFirst} & {brideFirst}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-300 mt-0.5">
                    {demo.venue.name}
                  </p>
                </div>

                {/* Floating "Click to Open Demo" Button on Hover */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current pl-0.5" />
                  </div>
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-white mt-3">
                    Watch It Open
                  </span>
                  <span className="text-[10px] text-amber-300">
                    Tap to experience {activeTheme.name} live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Quick-Select Carousel */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-zinc-300">
              ✦ Tap Any Design To Inspect In Top Screen:
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Scroll horizontally →
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
            {showcaseThemes.map((th) => {
              const isSelected = activeTheme.id === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setActiveTheme(th)}
                  className={`group shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-serif font-bold"
                    style={{ borderColor: th.primaryColor, color: th.primaryColor }}
                  >
                    {th.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                      <span>{th.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                      {th.series.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
