'use client';

import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';

interface VenueSectionProps {
  venue: {
    name: string;
    address: string;
    mapUrl: string;
    landmark?: string;
  };
  theme: ThemeDefinition;
}

export function VenueSection({ venue, theme }: VenueSectionProps) {
  return (
    <section className="w-full max-w-2xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <span
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: theme.primaryColor }}
        >
          Grand Destination
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-1 text-white">
          The Wedding Venue
        </h2>
        <div
          className="w-16 h-0.5 mx-auto mt-3"
          style={{ backgroundColor: theme.primaryColor }}
        />
      </div>

      <div
        className="rounded-3xl p-8 sm:p-10 border border-white/10 backdrop-blur-xl shadow-2xl text-center"
        style={{ backgroundColor: theme.cardBg || 'rgba(15,15,15,0.85)' }}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto flex items-center justify-center border border-white/10 mb-4 shadow-lg"
          style={{ color: theme.primaryColor }}
        >
          <Compass className="w-7 h-7" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          {venue.name}
        </h3>
        <p className="text-sm text-zinc-300 max-w-md mx-auto mb-2 leading-relaxed">
          {venue.address}
        </p>
        {venue.landmark && (
          <p className="text-xs text-amber-200/80 mb-6 italic">
            Landmark: {venue.landmark}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-transform transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#000',
            }}
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
}
