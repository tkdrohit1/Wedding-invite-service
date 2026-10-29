'use client';

import React from 'react';
import { Play, Sparkles, Flame, Eye, ArrowRight, Heart } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';
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

interface WishlyTemplateCardProps {
  theme: ThemeDefinition;
  index?: number;
  onPreviewClick: (theme: ThemeDefinition) => void;
  onCustomizeClick: (theme: ThemeDefinition) => void;
}

export function WishlyTemplateCard({
  theme,
  index = 0,
  onPreviewClick,
  onCustomizeClick,
}: WishlyTemplateCardProps) {
  const demoInvite = getDemoInviteForTheme(theme);
  const groomFirst = demoInvite.couple.groomName.split(' ')[0];
  const brideFirst = demoInvite.couple.brideName.split(' ')[0];
  const photo = demoInvite.couple.heroPhoto;

  // Architectural Archetype
  const getArchetype = (): 'jharokha' | 'temple' | 'mughal' | 'pichwai' | 'botanical' | 'editorial' | 'folk' => {
    const id = theme.id.toLowerCase();
    const series = theme.series;
    const religion = theme.religion || [];

    if (id.includes('pichwai') || id.includes('lotus-lake')) return 'pichwai';
    if (
      religion.includes('muslim') ||
      id.includes('nikah') ||
      id.includes('noor') ||
      id.includes('falaknuma') ||
      id.includes('mehfil')
    ) {
      return 'mughal';
    }
    if (
      series === 'Sacred Temple & South Indian' ||
      religion.includes('hindu_south') ||
      id.includes('temple') ||
      id.includes('oonjal') ||
      id.includes('mandap') ||
      id.includes('kalyanam') ||
      id.includes('tirupati') ||
      id.includes('chettinad')
    ) {
      return 'temple';
    }
    if (series === 'Floral, Garden & Nature' || religion.includes('christian')) return 'botanical';
    if (series === 'Modern Luxe, Celestial & Editorial') return 'editorial';
    if (series === 'Regional Heritage & Folk Art') return 'folk';
    return 'jharokha';
  };

  const archetype = getArchetype();

  // Reveal Label
  const getRevealLabel = () => {
    switch (theme.entranceReveal) {
      case 'palace_gates':
        return 'Palace Door Reveal';
      case 'envelope':
        return 'Wax-Sealed Envelope';
      case 'velvet_curtain':
        return 'Velvet Curtain Reveal';
      case 'film_play':
        return 'Signature Film';
      default:
        return 'Cinematic Reveal';
    }
  };

  // Collection Tier
  const getCollectionTier = () => {
    if (theme.badge) return theme.badge;
    if (theme.entranceReveal === 'film_play' || theme.series.includes('Modern Luxe')) {
      return 'Signature';
    }
    if (theme.series.includes('Royal Heritage') || theme.series.includes('Sacred Temple')) {
      return 'Grand';
    }
    return 'Essential';
  };

  // Tradition Label
  const getTraditionLabel = () => {
    if (theme.religion?.includes('muslim')) return 'Muslim';
    if (theme.religion?.includes('christian')) return 'Christian';
    if (theme.religion?.includes('hindu_south')) return 'South Indian';
    if (theme.religion?.includes('sikh')) return 'Sikh / Anand Karaj';
    if (theme.series === 'Floral, Garden & Nature') return 'Contemporary';
    return 'Hindu';
  };

  // Palette Name
  const getPaletteName = () => {
    if (archetype === 'temple') return 'Temple Gold';
    if (archetype === 'pichwai') return 'Pichwai Lotus';
    if (archetype === 'mughal') return 'Emerald Noor';
    if (archetype === 'botanical') return 'Botanical Sage';
    if (archetype === 'editorial') return 'Monochrome Luxe';
    if (archetype === 'folk') return 'Earth Terracotta';
    return 'Royal Marwar';
  };

  const collectionTier = getCollectionTier();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0d0c0a] ring-1 ring-white/10 hover:ring-1 hover:ring-[#e8c98a]/60 shadow-xl hover:shadow-[0_20px_60px_-20px_rgba(232,201,138,0.25)] transition-all duration-300 hover:-translate-y-2">
      {/* 1. Artwork / Media Banner (h-56) */}
      <div
        onClick={() => onPreviewClick(theme)}
        className="relative block h-56 w-full shrink-0 overflow-hidden cursor-pointer text-left select-none"
        style={{
          background: theme.bgGradient,
        }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl opacity-40"
          style={{ backgroundColor: theme.primaryColor }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#f4e3bd] shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{getRevealLabel()}</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8c98a]/20 backdrop-blur-md border border-[#e8c98a]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5dfaa] shadow-md">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{collectionTier}</span>
          </span>
        </div>

        {/* Architectural Motif Header Banner */}
        <div className="absolute top-10 inset-x-0 flex justify-center z-10 scale-90 origin-top pointer-events-none">
          {archetype === 'jharokha' && <RoyalJharokhaCrown color={theme.primaryColor} />}
          {archetype === 'temple' && <TempleGopuramHeader color={theme.primaryColor} />}
          {archetype === 'mughal' && <MughalMehrabArch color={theme.primaryColor} />}
          {archetype === 'pichwai' && <PichwaiLotusPond color={theme.primaryColor} />}
          {archetype === 'botanical' && <BotanicalFloralBower color={theme.primaryColor} />}
          {archetype === 'editorial' && (
            <EditorialMonogramHeader
              color={theme.primaryColor}
              groom={groomFirst}
              bride={brideFirst}
            />
          )}
          {archetype === 'folk' && <FolkArtHeaderBand color={theme.primaryColor} />}
        </div>

        {/* Center Couple Portrait & Flankers */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center pointer-events-none">
          {photo && (
            <div
              className={`relative overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 ${
                archetype === 'temple'
                  ? 'w-24 h-24 rounded-full border-2 bg-zinc-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : archetype === 'mughal'
                  ? 'w-24 h-28 rounded-t-full border-2 bg-zinc-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : archetype === 'pichwai'
                  ? 'w-24 h-24 rounded-full border-2 border-dashed bg-zinc-900'
                  : archetype === 'botanical'
                  ? 'w-24 h-24 rounded-full border-2 bg-zinc-900'
                  : archetype === 'editorial'
                  ? 'w-26 h-30 rounded-none border bg-zinc-900'
                  : 'w-24 h-24 rounded-2xl border bg-zinc-900'
              }`}
              style={{ borderColor: theme.primaryColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`${groomFirst} & ${brideFirst}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Left / Right Flankers */}
          {archetype === 'temple' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 scale-75 origin-right">
              <KuthuVilakkuLamp color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'mughal' && (
            <div className="absolute right-3 top-2 scale-75 origin-top-right">
              <HangingMoroccanLantern color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'pichwai' && (
            <div className="absolute right-2 bottom-0 scale-75 origin-bottom-right">
              <PichwaiSacredCow color={theme.primaryColor} flip />
            </div>
          )}
        </div>

        {/* Hover Overlay: "Try demo" Pill like Wishly */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-black shadow-2xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 fill-black text-black" />
            <span>Try demo</span>
          </span>
        </div>
      </div>

      {/* 2. Card Body Info (Wishly Layout) */}
      <div className="flex flex-1 flex-col p-5">
        {/* Row 1: Title & Collection Pill */}
        <div className="mb-1 flex items-center justify-between gap-3">
          <h3 className="text-lg font-serif font-bold text-white tracking-wide truncate">
            {theme.name}
          </h3>
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#e8c98a]/15 text-[#e8c98a] border border-[#e8c98a]/30 shrink-0">
            {collectionTier}
          </span>
        </div>

        {/* Row 2: Subtitle / Story Description */}
        <p className="mb-4 text-sm text-white/55 line-clamp-2 leading-relaxed">
          {theme.tagline || `${groomFirst} & ${brideFirst} celebrate their sacred union in ${demoInvite.venue.name}.`}
        </p>

        {/* Row 3: Palette Dots & Tradition Tag */}
        <div className="mb-5 flex items-center gap-1.5">
          <span
            className="h-4 w-4 rounded-full ring-1 ring-white/20 shadow-sm"
            style={{ backgroundColor: theme.primaryColor }}
            title="Primary Accent"
          />
          <span
            className="h-4 w-4 rounded-full ring-1 ring-white/20 shadow-sm"
            style={{ backgroundColor: theme.secondaryColor }}
            title="Secondary Accent"
          />
          <span
            className="h-4 w-4 rounded-full ring-1 ring-white/20 shadow-sm"
            style={{ backgroundColor: theme.accentColor || '#D4AF37' }}
            title="Accent Highlight"
          />
          <span className="ml-2 text-xs text-white/40 font-medium truncate max-w-[110px]">
            {getPaletteName()}
          </span>

          <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300 border border-white/10 shrink-0">
            {getTraditionLabel()}
          </span>
        </div>

        {/* Row 4: Action Buttons (Preview & Customize) */}
        <div className="mt-auto flex gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => onPreviewClick(theme)}
            className="flex-1 rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#0d0c0a] transition-all duration-200 text-center shadow-md active:scale-95"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={() => onCustomizeClick(theme)}
            className="flex-1 rounded-full bg-gradient-to-r from-[#e8c98a] to-[#d4b06a] px-4 py-2.5 text-sm font-semibold text-[#1a1105] shadow-lg hover:brightness-110 transition-all duration-200 text-center active:scale-95"
          >
            Customize
          </button>
        </div>
      </div>
    </article>
  );
}
