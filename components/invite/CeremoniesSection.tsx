'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt } from 'lucide-react';
import { CeremonyEvent, ThemeDefinition } from '@/lib/types';

interface CeremoniesSectionProps {
  ceremonies: CeremonyEvent[];
  theme: ThemeDefinition;
}

export function CeremoniesSection({ ceremonies, theme }: CeremoniesSectionProps) {
  if (!ceremonies || ceremonies.length === 0) return null;

  const handleAddToCalendar = (c: CeremonyEvent) => {
    const title = encodeURIComponent(c.title);
    const details = encodeURIComponent(c.description || `${c.title} celebration`);
    const location = encodeURIComponent(`${c.venueName}, ${c.venueAddress}`);

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  const isTemple =
    theme.series === 'Sacred Temple & South Indian' ||
    (theme.religion || []).includes('hindu_south');
  const isMughal = (theme.religion || []).includes('muslim');
  const isEditorial = theme.series === 'Modern Luxe, Celestial & Editorial';

  return (
    <section className="w-full max-w-2xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <span
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: theme.primaryColor }}
        >
          {isTemple ? '✦ Auspicious Thirumana Utsavams ✦' : isMughal ? '✦ Nikaah & Walima Ceremonies ✦' : '✦ Auspicious Celebrations ✦'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 text-white">
          Wedding Itinerary
        </h2>
        <div
          className="w-16 h-0.5 mx-auto mt-3"
          style={{ backgroundColor: theme.primaryColor }}
        />
      </div>

      <div className="space-y-6">
        {ceremonies.map((ceremony, idx) => (
          <div
            key={ceremony.id || idx}
            className={`group relative p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${
              isEditorial
                ? 'rounded-none border border-white/20 bg-black/90 hover:border-amber-400/50'
                : isTemple
                ? 'rounded-3xl border-t-2 border-b-2 border-x border-amber-600/30 bg-[#120c06]/85 hover:border-amber-500/60'
                : isMughal
                ? 'rounded-3xl border border-emerald-500/30 bg-[#06120e]/85 hover:border-emerald-400/60'
                : 'rounded-3xl border border-white/10 bg-zinc-900/80 hover:border-amber-500/40'
            }`}
            style={{
              borderColor: idx === 0 ? theme.primaryColor : undefined,
            }}
          >
            {/* Header / Number */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span
                  className="text-xs font-serif font-semibold tracking-widest uppercase opacity-85"
                  style={{ color: theme.primaryColor }}
                >
                  {isTemple ? `Event ${idx + 1} • Auspicious Muhurtham` : `Ceremony ${idx + 1}`}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                  {ceremony.title}
                </h3>
              </div>
              <span className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-xs font-serif text-amber-300 shadow">
                0{idx + 1}
              </span>
            </div>

            {ceremony.description && (
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6">
                {ceremony.description}
              </p>
            )}

            {/* Details Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ceremony.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ceremony.time}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{ceremony.venueName}, {ceremony.venueAddress}</span>
              </div>
              {ceremony.dressCode && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Shirt className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200">Dress Code: {ceremony.dressCode}</span>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="mt-5 pt-3 flex justify-end">
              <button
                onClick={() => handleAddToCalendar(ceremony)}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
