'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';

interface StorySectionProps {
  story?: string;
  storyDate?: string;
  theme: ThemeDefinition;
}

export function StorySection({ story, storyDate, theme }: StorySectionProps) {
  if (!story) return null;

  return (
    <section className="w-full max-w-2xl mx-auto my-12 px-4">
      <div
        className="relative rounded-3xl p-8 sm:p-12 text-center border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: theme.cardBg || 'rgba(15,15,15,0.85)' }}
      >
        <Quote
          className="w-12 h-12 mx-auto mb-4 opacity-40"
          style={{ color: theme.primaryColor }}
        />
        <span
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: theme.primaryColor }}
        >
          Our Journey
        </span>
        <h3 className="text-3xl font-serif font-bold text-white mt-1 mb-6">
          How Two Paths Became One
        </h3>

        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl mx-auto italic">
          &ldquo;{story}&rdquo;
        </p>

        {storyDate && (
          <div className="mt-6 text-xs uppercase tracking-widest text-zinc-400">
            — Forever Begins {storyDate} —
          </div>
        )}
      </div>
    </section>
  );
}
