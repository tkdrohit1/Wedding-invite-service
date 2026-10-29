'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WeddingInvite, ThemeDefinition } from '@/lib/types';
import { EntranceReveal } from '@/components/invite/EntranceReveal';
import { HeroCard } from '@/components/invite/HeroCard';
import { CeremoniesSection } from '@/components/invite/CeremoniesSection';
import { StorySection } from '@/components/invite/StorySection';
import { VenueSection } from '@/components/invite/VenueSection';
import { ScratchCard } from '@/components/invite/ScratchCard';
import { BlessingsWall } from '@/components/invite/BlessingsWall';
import { RsvpModal } from '@/components/invite/RsvpModal';
import { VideoModal } from '@/components/invite/VideoModal';
import { MusicPlayer } from '@/components/invite/MusicPlayer';
import {
  Film,
  HeartHandshake,
  Share2,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface InviteClientProps {
  invite: WeddingInvite;
  theme: ThemeDefinition;
  guestName?: string;
  isAdminBypass?: boolean;
}

export function InviteClient({
  invite,
  theme,
  guestName,
  isAdminBypass = false,
}: InviteClientProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Unrestricted: all restrictions removed
  const isLocked = false;

  const coupleTitle = `${invite.couple.groomName.split(' ')[0]} & ${invite.couple.brideName.split(' ')[0]}`;

  const fetchQrCode = async () => {
    setIsQrOpen(true);
    if (!qrDataUrl) {
      try {
        const res = await fetch(`/api/invites/${invite.slug}/qr`);
        const data = await res.json();
        if (data.success) {
          setQrDataUrl(data.qrDataUrl);
        }
      } catch {
        // Ignore
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${coupleTitle} Wedding Invitation`,
        text: `You are cordially invited to celebrate the royal wedding of ${coupleTitle}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Invitation link copied to clipboard!');
    }
  };

  return (
    <div
      className="min-h-screen text-white relative selection:bg-amber-400/30 selection:text-amber-200"
      style={{
        background: theme.bgGradient,
        fontFamily: theme.bodyFont || 'Montserrat, sans-serif',
      }}
    >
      {/* 1. Entrance Reveal Curtain / Gate / Envelope */}
      <EntranceReveal
        type={theme.entranceReveal}
        theme={theme}
        groomName={invite.couple.groomName}
        brideName={invite.couple.brideName}
        guestName={guestName}
        onOpen={() => setHasEntered(true)}
      />

      {/* Floating Action Top Navigation */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-black/50 border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xs uppercase tracking-widest font-serif font-bold truncate max-w-[140px] sm:max-w-xs"
              style={{ color: theme.primaryColor }}
            >
              {coupleTitle}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-zinc-300 font-sans border border-white/10">
              {theme.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invite.videoUrl && (
              <button
                onClick={() => setIsVideoOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-amber-200"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Watch Video</span>
              </button>
            )}

            <button
              onClick={fetchQrCode}
              title="View VIP QR Pass"
              className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-zinc-300 hover:text-white"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              title="Share Invitation"
              className="p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-zinc-300 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRsvpOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.primaryColor,
                color: '#000',
              }}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>RSVP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Invitation Sections - Fully Unrestricted */}
      <main className="relative z-10">
        <HeroCard invite={invite} theme={theme} guestName={guestName} />

        <StorySection
          story={invite.couple.ourStory}
          storyDate={invite.couple.storyDate}
          theme={theme}
        />

        <CeremoniesSection ceremonies={invite.ceremonies} theme={theme} />

        <VenueSection venue={invite.venue} theme={theme} />

        {invite.scratchCard?.enabled && (
          <ScratchCard
            secretMessage={invite.scratchCard.secretMessage}
            theme={theme}
          />
        )}

        {invite.blessingsWall?.enabled && (
          <BlessingsWall
            slug={invite.slug}
            initialMessages={invite.blessingsWall.messages}
            theme={theme}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-xl mx-auto my-8 p-6 text-center border-t border-white/10 text-xs text-zinc-400">
        <p className="mb-3">
          We warmly await your esteemed presence to celebrate our new beginnings.
        </p>
        <button
          onClick={() => setIsRsvpOpen(true)}
          className="px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl transition-transform transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: theme.primaryColor,
            color: '#000',
          }}
        >
          Confirm Your Attendance (RSVP)
        </button>
        <div className="mt-8 text-[11px] text-zinc-500">
          Created with EternalVows • Automated Luxury Wedding Invitation Engine
        </div>
      </footer>

      {/* QR Code Pass Modal */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xs rounded-3xl p-6 bg-stone-900 border border-amber-500/30 text-center shadow-2xl">
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="font-serif font-bold text-lg text-amber-200 mb-1">
              VIP Wedding Pass
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Scan this QR code with any mobile camera to open this invitation
            </p>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Wedding QR Code"
                className="w-56 h-56 mx-auto rounded-xl p-2 bg-white shadow-inner mb-4"
              />
            ) : (
              <div className="w-56 h-56 mx-auto rounded-xl bg-zinc-800 animate-pulse flex items-center justify-center mb-4">
                <span className="text-xs text-zinc-400">Generating QR...</span>
              </div>
            )}
            <p className="text-[10px] text-amber-300/80 font-mono">
              /invite/{invite.slug}
            </p>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        invite={invite}
        theme={theme}
      />

      {/* Video Modal with Restricted Lock support */}
      {invite.videoUrl && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={invite.videoUrl}
          coupleTitle={coupleTitle}
          theme={theme}
          isLocked={false}
        />
      )}

      {/* Background Music Player */}
      <MusicPlayer
        musicUrl={invite.musicUrl}
        theme={theme}
        autoPlay={hasEntered}
      />
    </div>
  );
}
