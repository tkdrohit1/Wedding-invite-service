# EternalVows — Automated Luxury Wedding Invitation & 9:16 Video Engine

EternalVows is an enterprise-grade automated digital wedding invitation engine and 1080×1920 vertical mobile MP4 video generator. It enables couples to generate bespoke, culturally authentic wedding websites, matching mobile video reveals, and printable scannable QR passes in under 60 seconds across **70 distinct design themes** inspired by trending Pinterest aesthetics and the signature [Wishly](https://wishly.co.in/weddings) catalog.

---

## 🌟 Highlights & Capabilities

- **70 Bespoke Cultural Themes (Not a 10×7 grid)**:
  - 15 Royal Heritage & Palace designs (Marwar gold, Udaipur Pichwai, City Palace, Mehrangarh, Sheesh Mahal, Falaknuma, Peacock Royale)
  - 13 Sacred Temple & South Indian designs (Divine Oonjal, Kanchipuram Silk, Thirukulam Pond, Thorana Greenery, Kasavu Gold, Madurai Gopuram, Chettinad)
  - 14 Regional Heritage & Folk Art (Phulkari, Indigo Bandhej, Rajbari Alpana, Paithani, Patan Patola, Ajrakh, Mithila Kohbar, Jamawar, Warli)
  - 10 Global Religions & Faith Traditions (Nikah Noor, Royal Nikah, Cathedral Grace, Anand Karaj, Harmandir Sahib, Goan Azulejo, Parsi Ashirwad, Jain Solah Sapna)
  - 10 Floral, Garden & Nature designs (Lotus Lake, Mogra & Jasmine, Roseleaf Botanical, Genda Phoolwari, Shalimar Terrace, Tuscany, Amalfi Grove)
  - 8 Modern Luxe & Editorial (Starlit Ride, Vogue Minimalist, Whispers on Water, Samudra Coastal, Rose Gold Noir, Art Deco)
- **4 Cinematic Entrance Reveal Styles**:
  1. 🏰 **Royal Palace Gates**: Double carved doors swing open with door knocker and celebration sparkles.
  2. ✉️ **3D Wax Seal Envelope**: Embossed seal unseals to reveal the royal card with custom guest monogram.
  3. 🎭 **Silk Velvet Curtain**: Dramatic stage curtains part left and right.
  4. 🎬 **Cinematic Play Button**: Modern pulsing play button with gold atmospheric ring.
- **Automated 1080×1920 9:16 Vertical Video Pipeline**:
  - Python 3.14 + Pillow + FFmpeg streaming pipeline renders ultra-sharp 30fps vertical MP4 videos in ~20 seconds with audio fades, typography, and couple portrait frames.
  - Zero disk clutter: frames stream directly into FFmpeg stdin.
- **Personalized Guest Links**:
  - Append `?to=Uncle+Vikram+and+Family` to any invite link to render personalized guest badges and customized welcoming salutations.
- **Interactive Guest Experience**:
  - 🎵 **Floating Music Player**: Audio player with animated rotating vinyl disc and cultural presets (Royal Shehnai, Sitar Flute, Nadaswaram, Sufi Qawwali, Piano & Strings).
  - 📅 **Add to Google Calendar**: 1-click sync for every individual ceremony (Haldi, Sangeet, Muhurtham, Reception).
  - 📍 **One-Tap Venue Maps**: Direct navigation link and landmark cues.
  - 🎁 **Interactive Scratch Card**: Canvas-based golden scratch card that guests swipe with touch/mouse to uncover hidden VIP passes or secret couple notes.
  - 💬 **Live Blessings Wall**: Dynamic guestbook for family and friends to send warm prayers.
  - 💌 **Seamless RSVP Management**: Joyfully Accept / Regretfully Decline with guest counter and dietary notes.
  - 📱 **VIP Scannable QR Pass**: Instant QR code modal for physical prints or check-in.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js 18+ (tested on Node 24)
- Python 3.10+ (tested on Python 3.14)
- FFmpeg (bundled with `imageio-ffmpeg` or system PATH)

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

### 4. Standalone Video Generation CLI
To generate a 1080×1920 9:16 vertical video directly via Python:
```bash
python video-engine/generator.py <slug>
```
Output will be saved directly into `public/videos/<slug>.mp4`.

---

## 📁 Project Architecture

```
wedding-invite-engine/
├── app/
│   ├── api/
│   │   └── invites/
│   │       ├── route.ts                     # List all invites & Create invite
│   │       └── [slug]/
│   │           ├── route.ts                 # Fetch single invite by slug
│   │           ├── rsvp/route.ts            # Submit RSVP
│   │           ├── blessing/route.ts        # Submit warm blessing
│   │           ├── generate-video/route.ts  # Spawn video engine worker
│   │           └── qr/route.ts              # Generate high-res QR code
│   ├── invite/
│   │   └── [slug]/
│   │       ├── page.tsx                     # Dynamic SSR invite route
│   │       └── InviteClient.tsx             # Interactive guest client
│   ├── globals.css                          # Luxury gold shimmers & animations
│   ├── layout.tsx                           # Global layout & metadata
│   └── page.tsx                             # Creator Studio & 70-theme catalog
├── components/
│   └── invite/
│       ├── EntranceReveal.tsx               # 4-style entrance reveal component
│       ├── HeroCard.tsx                     # Countdown, typography, framed portrait
│       ├── CeremoniesSection.tsx            # Itinerary with calendar export
│       ├── StorySection.tsx                 # How We Met love story
│       ├── VenueSection.tsx                 # Directions & landmarks
│       ├── ScratchCard.tsx                  # Interactive scratch foil canvas
│       ├── BlessingsWall.tsx                # Dynamic guestbook
│       ├── RsvpModal.tsx                    # RSVP submission modal
│       ├── VideoModal.tsx                   # 9:16 mobile video player & download
│       └── MusicPlayer.tsx                  # Floating vinyl music player
├── config/
│   └── themes.ts                            # Full registry of all 70 unique themes
├── data/
│   └── invites.json                         # Persistent JSON storage database
├── lib/
│   ├── types.ts                             # TypeScript data contracts
│   └── storage.ts                           # Storage methods & auto slug generation
├── public/
│   ├── audio/                               # Authentic royalty-free audio tracks
│   ├── images/                              # Couple portraits & graphics
│   └── videos/                              # Generated 1080x1920 mobile MP4s
└── video-engine/
    ├── fonts/                               # Regalia fonts (Cinzel, Playfair, Rozha, Vibes)
    └── generator.py                         # Streaming Pillow + FFmpeg video worker
```

---

## 💍 Live Demo Invites
- **Shubh Aarambh (Palace Grandeur)**: `/invite/deepak-and-pooja`
- **Nikah Noor (Emerald Mughal Arch)**: `/invite/zayd-and-aaliya`
- **Divine Oonjal (Carnatic Temple Tradition)**: `/invite/karthik-and-meenakshi`
