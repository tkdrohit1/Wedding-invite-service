'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Sparkles, Clock, Flame } from 'lucide-react';
import { ThemeDefinition, WeddingInvite } from '@/lib/types';
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
} from './Motifs';

interface HeroCardProps {
  invite: WeddingInvite;
  theme: ThemeDefinition;
  guestName?: string;
}

export function HeroCard({ invite, theme, guestName }: HeroCardProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(invite.weddingDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invite.weddingDate]);

  const formattedDate = new Date(invite.weddingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine Architectural Archetype
  const getArchetype = (): 'jharokha' | 'temple' | 'mughal' | 'pichwai' | 'botanical' | 'editorial' | 'folk' => {
    const id = theme.id.toLowerCase();
    const series = theme.series;
    const religion = theme.religion || [];

    if (id.includes('pichwai') || id.includes('lotus-lake')) {
      return 'pichwai';
    }
    if (religion.includes('muslim') || id.includes('nikah') || id.includes('noor') || id.includes('falaknuma') || id.includes('mehfil')) {
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

  // Cultural Invocation Text
  const getInvocation = () => {
    if (theme.religion.includes('muslim') || archetype === 'mughal') return 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    if (theme.religion.includes('christian')) return 'In the Holy Name of the Father, Son & Holy Spirit';
    if (theme.religion.includes('sikh')) return 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥';
    if (archetype === 'temple') return '|| ॐ श्री गणेशाय नमः • श्री महालक्ष्म्यै नमः ||';
    if (archetype === 'pichwai') return '|| श्री द्वारकाधीशाय नमः • श्री कृष्णाय शरणं मम ||';
    return '|| श्री गणेशाय नमः ||';
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      {/* 1. ARCHETYPE SPECIFIC OUTER CARD */}
      <div
        className={`relative overflow-hidden transition-all duration-500 text-center ${
          archetype === 'jharokha'
            ? 'rounded-[2.5rem] p-6 sm:p-10 border-2 shadow-2xl backdrop-blur-2xl bg-black/75'
            : archetype === 'temple'
            ? 'rounded-3xl p-5 sm:p-9 border-t-4 border-b-4 border-x border-amber-500/40 shadow-2xl backdrop-blur-2xl bg-[#0c0906]/90'
            : archetype === 'mughal'
            ? 'rounded-[2.5rem] p-6 sm:p-10 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl bg-[#06100d]/90'
            : archetype === 'pichwai'
            ? 'rounded-3xl p-6 sm:p-10 border-4 border-double border-amber-500/50 shadow-2xl backdrop-blur-2xl bg-[#120b05]/90'
            : archetype === 'botanical'
            ? 'rounded-[3rem] p-6 sm:p-10 border border-pink-500/20 shadow-2xl backdrop-blur-2xl bg-zinc-950/85'
            : archetype === 'editorial'
            ? 'rounded-xl p-8 sm:p-12 border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/95 text-left'
            : 'rounded-3xl p-6 sm:p-10 border-2 border-dashed border-amber-500/40 shadow-2xl backdrop-blur-2xl bg-zinc-950/90'
        }`}
        style={{
          borderColor: theme.primaryColor,
          boxShadow: `0 25px 60px -15px ${theme.primaryColor}25`,
        }}
      >
        {/* Background ambient lighting */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: theme.accentColor }}
        />

        {/* 2. ARCHETYPE HEADER MOTIFS */}
        {archetype === 'jharokha' && <RoyalJharokhaCrown color={theme.primaryColor} />}
        {archetype === 'temple' && (
          <>
            <TempleGopuramHeader color={theme.primaryColor} />
            <MangoLeafThoranam />
          </>
        )}
        {archetype === 'mughal' && <MughalMehrabArch color={theme.primaryColor} />}
        {archetype === 'botanical' && <BotanicalFloralBower color={theme.primaryColor} />}
        {archetype === 'folk' && <FolkArtHeaderBand color={theme.primaryColor} />}
        {archetype === 'editorial' && (
          <EditorialMonogramHeader
            groom={invite.couple.groomName}
            bride={invite.couple.brideName}
            color={theme.primaryColor}
          />
        )}

        {/* Theme Identification Pill Badge */}
        <div className={`mt-2 mb-4 ${archetype === 'editorial' ? 'text-left' : 'text-center'}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/15 bg-black/70 text-xs font-semibold tracking-wider text-amber-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme: {theme.name}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 font-normal text-[11px]">{theme.series}</span>
          </div>
        </div>

        {/* Guest Greeting Header */}
        {guestName && (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 mb-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cordially Invited: {guestName}</span>
          </div>
        )}

        {/* Cultural Invocation */}
        {archetype !== 'editorial' && (
          <p
            className="text-base sm:text-xl font-serif tracking-widest my-3 opacity-95"
            style={{ color: theme.primaryColor }}
          >
            {getInvocation()}
          </p>
        )}

        <p className="text-xs uppercase tracking-widest text-zinc-300 max-w-md mx-auto mb-6 opacity-85">
          Together with their families, cordially invite you to celebrate the marriage of
        </p>

        {/* 3. COUPLE PORTRAIT WITH ARCHETYPE SPECIFIC SURROUNDS */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Left Flanking Elements */}
          {archetype === 'temple' && (
            <div className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 hidden xs:block">
              <KuthuVilakkuLamp color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'mughal' && (
            <div className="absolute left-0 sm:left-4 top-0 hidden xs:block">
              <HangingMoroccanLantern color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'pichwai' && (
            <div className="absolute left-0 sm:left-4 bottom-2 hidden sm:block">
              <PichwaiSacredCow color={theme.primaryColor} />
            </div>
          )}

          {/* Photo Frame Container */}
          {invite.couple.heroPhoto && (
            <div
              className={`relative mx-auto transition-transform duration-700 hover:scale-105 ${
                archetype === 'jharokha'
                  ? 'w-48 h-56 sm:w-60 sm:h-72 rounded-t-[5rem] rounded-b-2xl p-2 border-4 shadow-2xl bg-zinc-900/60'
                  : archetype === 'temple'
                  ? 'w-48 h-56 sm:w-56 sm:h-64 rounded-t-[4rem] rounded-b-lg p-2.5 border-4 shadow-2xl bg-[#1a140d]'
                  : archetype === 'mughal'
                  ? 'w-48 h-56 sm:w-56 sm:h-68 rounded-t-[6rem] rounded-b-xl p-2 border-2 shadow-2xl bg-[#0b1914]'
                  : archetype === 'pichwai'
                  ? 'w-48 h-48 sm:w-60 sm:h-60 rounded-full p-2.5 border-4 border-dashed shadow-2xl bg-[#1b1008]'
                  : archetype === 'botanical'
                  ? 'w-48 h-48 sm:w-60 sm:h-60 rounded-full p-2 border-4 shadow-2xl bg-zinc-900'
                  : archetype === 'editorial'
                  ? 'w-full max-w-sm h-64 sm:h-80 rounded-none p-1 border shadow-2xl bg-zinc-900'
                  : 'w-48 h-48 sm:w-60 sm:h-60 rounded-2xl p-2 border-2 shadow-2xl bg-zinc-900'
              }`}
              style={{ borderColor: theme.primaryColor }}
            >
              <div className="w-full h-full overflow-hidden shadow-inner rounded-[inherit]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={invite.couple.heroPhoto}
                  alt={`${invite.couple.groomName} & ${invite.couple.brideName}`}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          )}

          {/* Right Flanking Elements */}
          {archetype === 'temple' && (
            <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 hidden xs:block">
              <KuthuVilakkuLamp color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'mughal' && (
            <div className="absolute right-0 sm:right-4 top-0 hidden xs:block">
              <HangingMoroccanLantern color={theme.primaryColor} />
            </div>
          )}
          {archetype === 'pichwai' && (
            <div className="absolute right-0 sm:right-4 bottom-2 hidden sm:block">
              <PichwaiSacredCow color={theme.primaryColor} flip />
            </div>
          )}
        </div>

        {/* 4. COUPLE NAMES */}
        <div className={`my-6 ${archetype === 'editorial' ? 'text-left' : 'text-center'}`}>
          <h1
            className={`font-serif font-bold tracking-tight mb-2 ${
              archetype === 'editorial'
                ? 'text-5xl sm:text-6xl uppercase tracking-tighter'
                : 'text-4xl sm:text-5xl'
            }`}
            style={{ color: theme.primaryColor }}
          >
            {invite.couple.groomName}
          </h1>
          {invite.couple.groomParents && (
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              Son of {invite.couple.groomParents}
              {invite.couple.groomFamilyFrom && ` (${invite.couple.groomFamilyFrom})`}
            </p>
          )}

          <div className={`flex items-center gap-4 my-4 ${archetype === 'editorial' ? 'justify-start' : 'justify-center'}`}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50" />
            <Heart
              className="w-5 h-5 fill-current animate-pulse"
              style={{ color: theme.primaryColor }}
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50" />
          </div>

          <h1
            className={`font-serif font-bold tracking-tight mb-2 ${
              archetype === 'editorial'
                ? 'text-5xl sm:text-6xl uppercase tracking-tighter'
                : 'text-4xl sm:text-5xl'
            }`}
            style={{ color: theme.primaryColor }}
          >
            {invite.couple.brideName}
          </h1>
          {invite.couple.brideParents && (
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              Daughter of {invite.couple.brideParents}
              {invite.couple.brideFamilyFrom && ` (${invite.couple.brideFamilyFrom})`}
            </p>
          )}
        </div>

        {/* 5. ARCHETYPE FOOTER ART */}
        {archetype === 'jharokha' && <RoyalElephantProcession color={theme.primaryColor} />}
        {archetype === 'temple' && <SouthIndianKolam color={theme.primaryColor} />}
        {archetype === 'pichwai' && <PichwaiLotusPond color={theme.primaryColor} />}

        {/* Date & Venue Badges */}
        <div className={`flex flex-wrap items-center gap-4 my-8 text-xs sm:text-sm ${
          archetype === 'editorial' ? 'justify-start' : 'justify-center'
        }`}>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 shadow">
            <Calendar className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span className="font-medium text-zinc-200">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 shadow">
            <MapPin className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span className="font-medium text-zinc-200">{invite.venue.name}</span>
          </div>
        </div>

        {/* 6. COUNTDOWN TIMER */}
        {invite.countdownEnabled && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">
              {archetype === 'temple' ? 'Auspicious Muhurtham Countdown' : 'Until We Say I Do'}
            </p>
            <div className={`grid grid-cols-4 gap-2 sm:gap-4 max-w-sm ${
              archetype === 'editorial' ? '' : 'mx-auto'
            }`}>
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl shadow-inner ${
                    archetype === 'jharokha'
                      ? 'bg-gradient-to-b from-black/80 to-amber-950/40 border border-amber-500/30'
                      : archetype === 'temple'
                      ? 'bg-[#181109] border border-amber-600/30'
                      : archetype === 'mughal'
                      ? 'bg-[#091510] border border-emerald-500/30'
                      : archetype === 'editorial'
                      ? 'bg-black border border-white/20 rounded-none'
                      : 'bg-black/50 border border-white/10'
                  }`}
                >
                  <span
                    className="text-2xl sm:text-3xl font-serif font-bold tracking-tight"
                    style={{ color: theme.primaryColor }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
