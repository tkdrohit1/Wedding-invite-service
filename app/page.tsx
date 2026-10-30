'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Filter,
  Flame,
  ArrowRight,
  Clock,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { WEDDING_THEMES } from '@/config/themes';
import { ThemeDefinition, ReligionCulture } from '@/lib/types';
import { WishlyTemplateCard } from '@/components/home/WishlyTemplateCard';
import { HeroShowcase } from '@/components/home/HeroShowcase';
import { WishlyDemoStageModal } from '@/components/home/WishlyDemoStageModal';

export default function HomePage() {
  // Filter States (Wishly-style Tradition & Collection Pills)
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Wishly Grand DemoStage Modal State
  const [previewModalTheme, setPreviewModalTheme] = useState<ThemeDefinition | null>(null);

  // Wizard States
  const [activeTab, setActiveTab] = useState<'gallery' | 'wizard'>('gallery');
  const [wizardStep, setWizardStep] = useState(1);
  const [chosenTheme, setChosenTheme] = useState<ThemeDefinition>(WEDDING_THEMES[0]);

  // Form Fields
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState('couple@example.com');
  const [groomName, setGroomName] = useState('Deepak Sharma');
  const [groomParents, setGroomParents] = useState('Smt. Shanti & Sri Ramesh Sharma');
  const [groomFamilyFrom, setGroomFamilyFrom] = useState('Jaipur');
  const [brideName, setBrideName] = useState('Pooja Verma');
  const [brideParents, setBrideParents] = useState('Smt. Sunita & Sri Rajesh Verma');
  const [brideFamilyFrom, setBrideFamilyFrom] = useState('Udaipur');
  const [weddingDate, setWeddingDate] = useState('2026-11-28T18:00');
  const [heroPhoto, setHeroPhoto] = useState(
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
  );
  const [ourStory, setOurStory] = useState(
    'From serendipitous college library smiles to a starry desert engagement in Jaisalmer, our journey has been a melody of laughter, shared dreams, and endless love.'
  );

  // Venue
  const [venueName, setVenueName] = useState('The Oberoi Udaivilas');
  const [venueAddress, setVenueAddress] = useState('Haridas Ji Ki Magri, Udaipur, Rajasthan');
  const [venueMapUrl, setVenueMapUrl] = useState('https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur');

  // Ceremonies
  const [ceremonies] = useState([
    {
      id: 'c1',
      title: 'Haldi & Mehendi Celebration',
      date: 'November 27, 2026',
      time: '10:00 AM',
      venueName: 'Courtyard of Lotuses',
      venueAddress: 'The Oberoi Udaivilas',
      dressCode: 'Festive Yellow',
    },
    {
      id: 'c2',
      title: 'Sangeet & Royal Cocktails',
      date: 'November 27, 2026',
      time: '07:00 PM',
      venueName: 'Chandra Mahal Ballroom',
      venueAddress: 'The Oberoi Udaivilas',
      dressCode: 'Glamorous Regal / Tuxedo',
    },
    {
      id: 'c3',
      title: 'Vivaah Sanskar (Saat Phere)',
      date: 'November 28, 2026',
      time: '05:00 PM',
      venueName: 'Grand Lakeview Mandapam',
      venueAddress: 'Lake Pichola Shore',
      dressCode: 'Royal Traditional Indian',
    },
  ]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter Themes (Wishly Tradition & Collection Categories)
  const filteredThemes = useMemo(() => {
    return WEDDING_THEMES.filter((theme) => {
      if (selectedFilter === 'hindu') {
        const isNorth =
          theme.religion.includes('hindu_north') ||
          theme.religion.includes('gujarati') ||
          theme.religion.includes('marathi') ||
          theme.religion.includes('bengali');
        if (!isNorth) return false;
      } else if (selectedFilter === 'temple') {
        const isSouth =
          theme.series === 'Sacred Temple & South Indian' ||
          theme.religion.includes('hindu_south') ||
          theme.religion.includes('telugu') ||
          theme.religion.includes('tamil') ||
          theme.religion.includes('kannada') ||
          theme.religion.includes('malayalee');
        if (!isSouth) return false;
      } else if (selectedFilter === 'muslim') {
        if (!theme.religion.includes('muslim')) return false;
      } else if (selectedFilter === 'christian') {
        if (!theme.religion.includes('christian') && theme.series !== 'Floral, Garden & Nature')
          return false;
      } else if (selectedFilter === 'grand') {
        if (theme.series !== 'Royal Heritage & Palace') return false;
      } else if (selectedFilter === 'films') {
        if (
          theme.entranceReveal !== 'film_play' &&
          theme.series !== 'Modern Luxe, Celestial & Editorial'
        )
          return false;
      }

      if (
        searchQuery &&
        !theme.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !theme.tagline.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !theme.series.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  // Handle Form Submission -> Pending Approval
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        themeId: chosenTheme.id,
        title: `The Wedding Celebration of ${groomName.split(' ')[0]} & ${brideName.split(' ')[0]}`,
        status: 'pending_approval', // User submission requires admin permission!
        contactInfo: {
          phone: customerPhone,
          email: customerEmail,
        },
        couple: {
          groomName,
          groomParents,
          groomFamilyFrom,
          brideName,
          brideParents,
          brideFamilyFrom,
          heroPhoto,
          ourStory,
          storyDate: new Date(weddingDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        },
        weddingDate: new Date(weddingDate).toISOString(),
        countdownEnabled: true,
        ceremonies,
        venue: {
          name: venueName,
          address: venueAddress,
          mapUrl: venueMapUrl,
        },
        rsvp: {
          enabled: true,
          phone: customerPhone,
          submissions: [],
        },
        blessingsWall: {
          enabled: true,
          messages: [],
        },
        scratchCard: {
          enabled: true,
          secretMessage: 'VIP Pass: Exclusive invite to the Palace Rooftop Stargazing Lounge! 🥂',
        },
        musicUrl: chosenTheme.musicUrl,
        videoUrl: `/videos/${groomName.split(' ')[0].toLowerCase()}-and-${brideName.split(' ')[0].toLowerCase()}.mp4`,
      };

      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.invite) {
        setSubmittedSlug(data.invite.slug);
      } else {
        alert(data.error || 'Failed to submit invitation request');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Error submitting request: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 font-sans selection:bg-amber-400/30 selection:text-amber-200">
      {/* Top Global Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="EternalVows Logo"
              className="w-11 h-11 rounded-full border border-amber-400/40 shadow-lg shadow-amber-500/20 object-cover"
            />
            <div>
              <span className="font-serif font-bold text-lg tracking-wider text-amber-200">
                EternalVows
              </span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-none">
                Luxury Wedding Invitation Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'gallery'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              70 Themes Catalog
            </button>
            <button
              onClick={() => {
                setActiveTab('wizard');
                setSubmittedSlug(null);
              }}
              className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Customize Invitation</span>
            </button>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-1.5"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Top Screen Interactive Hero Showcase (Wishly Experience) */}
      <HeroShowcase
        onOpenPreview={(theme) => setPreviewModalTheme(theme)}
        onCustomizeClick={() => {
          setActiveTab('wizard');
          setSubmittedSlug(null);
        }}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'gallery' ? (
          <div>
            {/* Wishly Filter Bar */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-10 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by theme name (e.g. Pichwai, Oonjal, Nikah)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 w-full md:w-auto justify-end">
                  <Filter className="w-3.5 h-3.5" />
                  <span>
                    Showing <strong className="text-amber-300">{filteredThemes.length}</strong> of 70 unique patterns
                  </span>
                </div>
              </div>

              {/* Wishly Tradition Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All designs (70)' },
                  { id: 'hindu', label: 'Hindu Traditions' },
                  { id: 'temple', label: 'South Indian & Temple' },
                  { id: 'muslim', label: 'Muslim & Nikah' },
                  { id: 'christian', label: 'Christian & Floral' },
                  { id: 'grand', label: 'Grand Palace Heritage' },
                  { id: 'films', label: 'Signature Animated Films' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedFilter(s.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedFilter === s.id
                        ? 'bg-gradient-to-r from-[#e8c98a] to-[#d4b06a] text-[#1a1105] font-semibold shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishly Signature Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredThemes.map((theme, index) => (
                <WishlyTemplateCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  onPreviewClick={(t) => setPreviewModalTheme(t)}
                  onCustomizeClick={(t) => {
                    setChosenTheme(t);
                    setActiveTab('wizard');
                    setWizardStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* WIZARD STUDIO WITH APPROVAL GATE */
          <div className="max-w-3xl mx-auto">
            {submittedSlug ? (
              /* Awaiting Approval Screen */
              <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
                <div className="w-20 h-20 rounded-full mx-auto bg-amber-400 text-black flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20">
                  <Clock className="w-10 h-10 animate-spin" />
                </div>

                <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
                  Order Submitted For Review
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1 mb-3">
                  Awaiting Owner Confirmation
                </h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8">
                  Your invitation details for{' '}
                  <strong className="text-amber-300">{chosenTheme.name}</strong> have been
                  received by our admin. Once confirmed, your full invitation link and 1080×1920
                  WhatsApp story video will be generated and unlocked.
                </p>

                {/* Draft Preview Link Box */}
                {(() => {
                  const liveUrl =
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/invite/${submittedSlug}`
                      : `/invite/${submittedSlug}`;
                  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE || '919876543210';
                  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'studio@eternalvows.com';
                  const waText = `Hi EternalVows Studio! 💌\n\nI have submitted a wedding invitation order on your site:\n\n💍 Couple: ${groomName} & ${brideName}\n🎨 Theme: ${chosenTheme.name}\n📅 Date: ${new Date(weddingDate).toLocaleDateString()}\n📍 Venue: ${venueName}\n📞 Phone: ${customerPhone}\n✉️ Email: ${customerEmail}\n🔗 Draft Preview: ${liveUrl}\n\nPlease confirm our booking and unlock the full invitation and video!`;
                  const waUrl = `https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;
                  const mailtoUrl = `mailto:${ownerEmail}?subject=${encodeURIComponent(`Wedding Invite Order - ${groomName} & ${brideName}`)}&body=${encodeURIComponent(waText)}`;

                  return (
                    <>
                      <div className="bg-black/60 border border-white/10 rounded-2xl p-6 text-left max-w-lg mx-auto mb-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Draft Preview Link (2 Screens Active)</span>
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase">Under Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={liveUrl}
                            className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-xs text-amber-200 font-mono select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(liveUrl);
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="px-3 py-2 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          You can view the entrance reveal and header screens immediately. Full itinerary,
                          venue map, and video download will be activated after admin confirmation.
                        </p>
                      </div>

                      {/* Immediate Lead Transmission / WhatsApp Notification */}
                      <div className="max-w-lg mx-auto mb-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 border border-emerald-500/30 text-left space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow">
                            <MessageCircle className="w-4 h-4 fill-black text-black" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                              Fast-Track Confirmation on WhatsApp
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              Send your order details directly to our studio team on WhatsApp for instant confirmation.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4 fill-black" />
                            <span>Send Order on WhatsApp</span>
                          </a>

                          <a
                            href={mailtoUrl}
                            className="px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/15 flex items-center gap-1.5 transition"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Studio</span>
                          </a>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={`/invite/${submittedSlug}`}
                    target="_blank"
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400 text-black shadow-lg flex items-center gap-2"
                  >
                    <span>View 2-Screen Draft Preview</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/admin"
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Go to Admin Approval Panel</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Multi-step Form */
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                  {[
                    { num: 1, label: 'Theme' },
                    { num: 2, label: 'Couple Details' },
                    { num: 3, label: 'Events & Venue' },
                    { num: 4, label: 'Contact & Submit' },
                  ].map((s) => (
                    <div
                      key={s.num}
                      onClick={() => setWizardStep(s.num)}
                      className={`flex items-center gap-2 cursor-pointer transition-colors ${
                        wizardStep === s.num
                          ? 'text-amber-300 font-bold'
                          : wizardStep > s.num
                          ? 'text-emerald-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          wizardStep === s.num
                            ? 'bg-amber-400 text-black'
                            : wizardStep > s.num
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {s.num}
                      </div>
                      <span className="text-xs hidden sm:inline">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* STEP 1: THEME SELECTION */}
                {wizardStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Selected Theme: {chosenTheme.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">{chosenTheme.tagline}</p>

                    <div
                      className="p-6 rounded-2xl border border-amber-400/30 mb-8"
                      style={{ background: chosenTheme.bgGradient }}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-black/60 text-zinc-300">
                        {chosenTheme.series}
                      </span>
                      <h4
                        className="text-3xl font-serif font-bold mt-3"
                        style={{ color: chosenTheme.primaryColor }}
                      >
                        {chosenTheme.name}
                      </h4>
                      <div className="mt-4 flex gap-4 text-xs text-zinc-300">
                        <div>
                          <strong>Reveal:</strong> {chosenTheme.entranceReveal}
                        </div>
                        <div>
                          <strong>Music:</strong> {chosenTheme.musicPreset}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setWizardStep(2)}
                      className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-amber-400 text-black shadow-xl"
                    >
                      Proceed to Couple Details &rarr;
                    </button>
                  </div>
                )}

                {/* STEP 2: COUPLE DETAILS */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      Couple & Family Details
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">
                      Enter names, parents, and background story for the couple.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Groom&apos;s Full Name
                        </label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Groom&apos;s Parents
                        </label>
                        <input
                          type="text"
                          value={groomParents}
                          onChange={(e) => setGroomParents(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Bride&apos;s Full Name
                        </label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Bride&apos;s Parents
                        </label>
                        <input
                          type="text"
                          value={brideParents}
                          onChange={(e) => setBrideParents(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Wedding Date & Muhurtham Time
                        </label>
                        <input
                          type="datetime-local"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Couple Portrait Photo URL
                        </label>
                        <input
                          type="text"
                          value={heroPhoto}
                          onChange={(e) => setHeroPhoto(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                        Our Story Quote
                      </label>
                      <textarea
                        rows={2}
                        value={ourStory}
                        onChange={(e) => setOurStory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="px-6 py-3 rounded-xl border border-white/15 text-xs uppercase font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setWizardStep(3)}
                        className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-xs font-bold uppercase tracking-wider shadow-lg"
                      >
                        Proceed to Events & Venue &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: EVENTS & VENUE */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      Venue & Ceremonies
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6">
                      Configure the celebration venue and itinerary events.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Main Venue Name
                        </label>
                        <input
                          type="text"
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Venue Full Address
                        </label>
                        <input
                          type="text"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                        Google Maps Link
                      </label>
                      <input
                        type="text"
                        value={venueMapUrl}
                        onChange={(e) => setVenueMapUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-mono text-xs"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setWizardStep(2)}
                        className="px-6 py-3 rounded-xl border border-white/15 text-xs uppercase font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setWizardStep(4)}
                        className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-xs font-bold uppercase tracking-wider shadow-lg"
                      >
                        Proceed to Contact & Submit &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT & SUBMIT */}
                {wizardStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white mb-1">
                        Contact Information & Request Review
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Enter your contact details so our admin can confirm your order before activating.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Contact Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                          Contact Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Selected Theme:</span>
                        <strong className="text-amber-300">{chosenTheme.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Couple:</span>
                        <strong className="text-white">
                          {groomName} & {brideName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Date:</span>
                        <strong className="text-white">
                          {new Date(weddingDate).toLocaleDateString()}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Venue:</span>
                        <strong className="text-white">{venueName}</strong>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10 text-amber-200">
                        <span>Initial Status:</span>
                        <strong className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted for Owner Review</span>
                        </strong>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setWizardStep(3)}
                        className="px-6 py-3 rounded-xl border border-white/15 text-xs uppercase font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm uppercase tracking-wider shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>
                          {isSubmitting ? 'Submitting Request...' : 'Submit Invitation Request'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-zinc-500">
        <p>
          EternalVows Wedding Platform • 70 Culturally Authentic Digital Invitations & WhatsApp
          Vertical Videos.
        </p>
      </footer>
      {/* Wishly Grand DemoStage Modal */}
      {previewModalTheme && (
        <WishlyDemoStageModal
          theme={previewModalTheme}
          onClose={() => setPreviewModalTheme(null)}
          onSelectTheme={(t) => {
            setChosenTheme(t);
            setActiveTab('wizard');
            setWizardStep(2);
            setPreviewModalTheme(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Floating WhatsApp Concierge Button */}
      <a
        href={`https://wa.me/${(process.env.NEXT_PUBLIC_OWNER_PHONE || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          'Hi EternalVows Studio! 💌 I am looking for a luxury wedding invitation. Can you help me choose and customize a design?'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black px-4 py-3 shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95 font-semibold text-xs tracking-wide"
        title="Chat with Wedding Concierge on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-black" />
        <span className="font-bold hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
