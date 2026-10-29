'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThemeDefinition } from '@/lib/types';

interface ScratchCardProps {
  secretMessage: string;
  theme: ThemeDefinition;
}

export function ScratchCard({ secretMessage, theme }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Luxury Golden Metallic Scratch Coating
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.3, '#AA771C');
    gradient.addColorStop(0.5, '#FFDF73');
    gradient.addColorStop(0.7, '#AA771C');
    gradient.addColorStop(1, '#8B5A2B');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative Pattern & Text on Scratch Surface
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = '#1A0E05';
    ctx.font = 'bold 15px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL ✨', width / 2, height / 2 - 10);
    ctx.font = '11px Montserrat, sans-serif';
    ctx.fillText('A Special Surprise Awaits You', width / 2, height / 2 + 15);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage occasionally
    if (Math.random() < 0.2) {
      checkScratchedPercent(ctx, canvas.width, canvas.height);
    }
  };

  const checkScratchedPercent = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      let cleared = 0;
      for (let i = 3; i < imgData.data.length; i += 16) {
        if (imgData.data[i] === 0) cleared++;
      }
      const totalSampled = imgData.data.length / 16;
      if (cleared / totalSampled > 0.35 && !isRevealed) {
        setIsRevealed(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: [theme.primaryColor, '#FFD700', '#FFF'],
        });
      }
    } catch {
      // Ignore
    }
  };

  return (
    <section className="w-full max-w-md mx-auto my-12 px-4 text-center">
      <div className="mb-4">
        <span
          className="text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
          style={{ color: theme.primaryColor }}
        >
          <Gift className="w-4 h-4" />
          <span>Interactive Surprise</span>
        </span>
        <h3 className="text-2xl font-serif font-bold text-white mt-1">
          Couple&apos;s Secret Note
        </h3>
      </div>

      <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-zinc-950 flex items-center justify-center p-6">
        {/* Hidden Message Layer */}
        <div className="text-center px-4">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-400 animate-spin" />
          <p className="text-sm sm:text-base font-serif font-medium text-amber-200 leading-relaxed">
            {secretMessage}
          </p>
        </div>

        {/* Scratch Canvas Overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={380}
            height={190}
            onMouseDown={() => (isDrawing.current = true)}
            onMouseUp={() => (isDrawing.current = false)}
            onMouseLeave={() => (isDrawing.current = false)}
            onMouseMove={(e) => {
              if (isDrawing.current) scratch(e.clientX, e.clientY);
            }}
            onTouchStart={() => (isDrawing.current = true)}
            onTouchEnd={() => (isDrawing.current = false)}
            onTouchMove={(e) => {
              if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
            }}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          />
        )}
      </div>
      <p className="text-[11px] text-zinc-400 mt-2">
        {isRevealed ? 'Surprise Unlocked! ✨' : 'Swipe your finger or mouse across to scratch off'}
      </p>
    </section>
  );
}
