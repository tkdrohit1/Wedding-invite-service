'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { ThemeDefinition } from '@/lib/types';

interface MusicPlayerProps {
  musicUrl?: string;
  theme: ThemeDefinition;
  autoPlay?: boolean;
}

export function MusicPlayer({ musicUrl, theme, autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay was blocked, will wait for user click
          setIsPlaying(false);
        });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const src = musicUrl || theme.musicUrl || '/audio/royal-shehnai.mp3';

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={togglePlay}
          className="group relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full border border-amber-500/40 bg-black/80 backdrop-blur-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          style={{ borderColor: theme.primaryColor }}
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          {/* Animated vinyl / music icon */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-1000 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{
              backgroundColor: theme.primaryColor,
              color: '#000',
            }}
          >
            <Music className="w-3.5 h-3.5" />
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium leading-none">
              {isPlaying ? 'Now Playing' : 'Music Paused'}
            </p>
            <p className="text-xs font-serif font-bold text-amber-200 truncate max-w-[120px] leading-tight">
              {theme.musicPreset}
            </p>
          </div>

          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-400 ml-1" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500 ml-1" />
          )}
        </button>
      </div>
    </>
  );
}
