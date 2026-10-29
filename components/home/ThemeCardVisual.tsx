'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Eye, Lock } from 'lucide-react';
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

interface ThemeCardVisualProps {
  theme: ThemeDefinition;
  onPreviewClick?: () => void;
}

export function ThemeCardVisual({ theme, onPreviewClick }: ThemeCardVisualProps) {
  const demoInvite = getDemoInviteForTheme(theme);
  const groomFirst = demoInvite.couple.groomName.split(' ')[0];
  const brideFirst = demoInvite.couple.brideName.split(' ')[0];
  const photo = demoInvite.couple.heroPhoto;

  // Determine Architectural Archetype
  const getArchetype = (): 'jharokha' | 'temple' | 'mughal' | 'pichwai' | 'botanical' | 'editorial' | 'folk' => {
    const id = theme.id.toLowerCase();
    const series = theme.series;
    const religion = theme.religion || [];

    if (id.includes('pichwai') || id.includes('lotus-lake')) {
      return 'pichwai';
    }
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
      id.includes('meenakshi') ||
      id.includes('rameswaram')
    ) {
      return 'temple';
    }
    if (
      series === 'Regional Heritage & Folk Art' ||
      id.includes('madhubani') ||
      id.includes('warli') ||
      id.includes('phulkari') ||
      id.includes('patola') ||
      id.includes('ajrakh') ||
      id.includes('kalamkari') ||
      id.includes('gond')
    ) {
      return 'folk';
    }
    if (
      series === 'Floral, Garden & Nature' ||
      religion.includes('christian') ||
      id.includes('cathedral') ||
      id.includes('chapel') ||
      id.includes('floral') ||
      id.includes('rose') ||
      id.includes('jasmine')
    ) {
      return 'botanical';
    }
    if (
      series === 'Modern Luxe, Celestial & Editorial' ||
      id.includes('vogue') ||
      id.includes('zenith') ||
      id.includes('monochrome') ||
      id.includes('editorial') ||
      id.includes('art-deco')
    ) {
      return 'editorial';
    }
    return 'jharokha';
  };

  const archetype = getArchetype();

  const Wrapper = onPreviewClick ? 'div' : Link;
  const wrapperProps = onPreviewClick
    ? {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          onPreviewClick();
        },
        role: 'button',
      }
    : {
        href: `/invite/demo-${theme.id}`,
        target: '_blank',
      };

  return (
    // @ts-expect-error dynamic wrapper props
    <Wrapper
      {...wrapperProps}
      className="group/visual relative block w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 border border-white/15 bg-black/60 shadow-2xl transition-all duration-500 hover:border-amber-400/80 hover:shadow-amber-500/10 cursor-pointer select-none"
      style={{
        background: theme.bgGradient,
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl opacity-30 pointer-events-none transition-opacity group-hover/visual:opacity-50"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Miniature Phone Bezel Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-16 h-1 rounded-full bg-white/20 backdrop-blur" />

      {/* Live Preview Badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[9px] font-semibold text-amber-300 shadow">
        <Lock className="w-2.5 h-2.5" />
        <span>Live Preview</span>
      </div>

      {/* Miniature Architectural Canvas */}
      <div className="relative w-full h-full p-4 flex flex-col justify-between items-center text-center overflow-hidden">
        {/* Top Header Motif */}
        <div className="w-full flex justify-center mt-3 scale-90 sm:scale-95 origin-top">
          {archetype === 'jharokha' && <RoyalJharokhaCrown color={theme.primaryColor} />}
          {archetype === 'temple' && (
            <div className="w-full">
              <TempleGopuramHeader color={theme.primaryColor} />
              <MangoLeafThoranam />
            </div>
          )}
          {archetype === 'mughal' && <MughalMehrabArch color={theme.primaryColor} />}
          {archetype === 'botanical' && <BotanicalFloralBower color={theme.primaryColor} />}
          {archetype === 'folk' && <FolkArtHeaderBand color={theme.primaryColor} />}
          {archetype === 'editorial' && (
            <EditorialMonogramHeader
              groom={groomFirst}
              bride={brideFirst}
              color={theme.primaryColor}
            />
          )}
        </div>

        {/* Center: Couple Framed Silhouette / Portrait with Side Ornaments */}
        <div className="relative w-full my-auto flex items-center justify-center">
          {/* Left Flanker */}
          {archetype === 'temple' && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 origin-left">
              <KuthuVilakkuLamp color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'mughal' && (
            <div className="absolute left-2 top-0 scale-75 origin-top-left">
              <HangingMoroccanLantern color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'pichwai' && (
            <div className="absolute left-1 bottom-0 scale-75 origin-bottom-left">
              <PichwaiSacredCow color={theme.primaryColor} />
            </div>
          )}

          {/* Miniature Photo Frame */}
          {photo && (
            <div
              className={`relative overflow-hidden transition-transform duration-500 group-hover/visual:scale-105 shadow-xl ${
                archetype === 'jharokha'
                  ? 'w-28 h-32 rounded-t-[3rem] rounded-b-lg border-2 bg-zinc-900'
                  : archetype === 'temple'
                  ? 'w-28 h-32 rounded-t-[2.5rem] rounded-b-md border-2 bg-[#1a140d]'
                  : archetype === 'mughal'
                  ? 'w-28 h-34 rounded-t-[3.5rem] rounded-b-lg border-2 bg-[#0b1914]'
                  : archetype === 'pichwai'
                  ? 'w-28 h-28 rounded-full border-2 border-dashed bg-[#1b1008]'
                  : archetype === 'botanical'
                  ? 'w-28 h-28 rounded-full border-2 bg-zinc-900'
                  : archetype === 'editorial'
                  ? 'w-32 h-36 rounded-none border bg-zinc-900'
                  : 'w-28 h-28 rounded-xl border bg-zinc-900'
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

          {/* Right Flanker */}
          {archetype === 'temple' && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 scale-75 origin-right">
              <KuthuVilakkuLamp color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'mughal' && (
            <div className="absolute right-2 top-0 scale-75 origin-top-right">
              <HangingMoroccanLantern color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'pichwai' && (
            <div className="absolute right-1 bottom-0 scale-75 origin-bottom-right">
              <PichwaiSacredCow color={theme.primaryColor} flip />
            </div>
          )}
        </div>

        {/* Bottom Couple Text & Ornaments */}
        <div className="w-full pb-1">
          <p
            className="text-base sm:text-lg font-serif font-bold tracking-wide truncate px-2"
            style={{ color: theme.primaryColor }}
          >
            {groomFirst} & {brideFirst}
          </p>

          <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-sans mt-0.5">
            {demoInvite.venue.name}
          </p>

          {/* Miniature Bottom Artwork */}
          <div className="scale-75 origin-bottom mt-1 flex justify-center">
            {archetype === 'jharokha' && <RoyalElephantProcession color={theme.primaryColor} />}
            {archetype === 'temple' && <SouthIndianKolam color={theme.primaryColor} />}
            {archetype === 'pichwai' && <PichwaiLotusPond color={theme.primaryColor} />}
          </div>
        </div>

        {/* Interactive Hover Overlay: "Preview Live Design" */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover/visual:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl shadow-amber-500/30 transform scale-75 group-hover/visual:scale-100 transition-transform duration-300">
            <Eye className="w-6 h-6" />
          </div>
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-white">
            Preview Invitation
          </span>
          <span className="text-[10px] text-amber-300 font-sans">
            Click to test {theme.name} live
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
