export type EntranceType = 'envelope' | 'palace_gates' | 'velvet_curtain' | 'film_play';

export type ReligionCulture =
  | 'hindu_north'
  | 'hindu_south'
  | 'muslim'
  | 'christian'
  | 'sikh'
  | 'marathi'
  | 'bengali'
  | 'gujarati'
  | 'telugu'
  | 'tamil'
  | 'kannada'
  | 'malayalee'
  | 'interfaith'
  | 'modern';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'gu'
  | 'mr'
  | 'bn'
  | 'pa'
  | 'ur';

export type MotifType =
  | 'peacock'
  | 'mandala'
  | 'elephant'
  | 'lotus'
  | 'crescent'
  | 'cross'
  | 'khanda'
  | 'kalash'
  | 'floral'
  | 'paisley'
  | 'oonjal'
  | 'marigold'
  | 'diya'
  | 'geometric'
  | 'swan';

export type BorderStyle =
  | 'ornate_gold'
  | 'temple_pillar'
  | 'islamic_arch'
  | 'floral_wreath'
  | 'minimal_gold'
  | 'geometric_lattice'
  | 'vintage_filigree'
  | 'royal_arch';

export type InviteStatus = 'pending_approval' | 'approved' | 'rejected';

export interface CeremonyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapUrl?: string;
  dressCode?: string;
  icon?: string;
  description?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  series:
    | 'Royal Heritage & Palace'
    | 'Sacred Temple & South Indian'
    | 'Regional Heritage & Folk Art'
    | 'Global Religions & Faith Traditions'
    | 'Floral, Garden & Nature'
    | 'Modern Luxe, Celestial & Editorial';
  tagline: string;
  religion: ReligionCulture[];
  languages: LanguageCode[];
  primaryColor: string; // Primary accent (e.g. Gold #D4AF37)
  secondaryColor: string; // Supporting color
  accentColor: string;
  bgGradient: string; // CSS background
  cardBg: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  motif: MotifType;
  entranceReveal: EntranceType;
  musicPreset: string;
  musicUrl: string;
  borderStyle: BorderStyle;
  badge?: string;
}

export interface RsvpSubmission {
  id: string;
  guestName: string;
  attending: boolean;
  guestCount: number;
  message?: string;
  submittedAt: string;
}

export interface BlessingItem {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface ContactInfo {
  phone: string;
  email?: string;
  notes?: string;
}

export interface WeddingInvite {
  id: string;
  slug: string;
  themeId: string;
  title: string;
  status: InviteStatus;
  isDemoTemplate?: boolean;
  contactInfo?: ContactInfo;
  couple: {
    groomName: string;
    groomParents?: string;
    groomFamilyFrom?: string;
    brideName: string;
    brideParents?: string;
    brideFamilyFrom?: string;
    heroPhoto?: string;
    ourStory?: string;
    storyDate?: string;
  };
  weddingDate: string; // ISO string e.g. "2026-11-28T10:00:00"
  countdownEnabled: boolean;
  ceremonies: CeremonyEvent[];
  venue: {
    name: string;
    address: string;
    mapUrl: string;
    landmark?: string;
  };
  rsvp: {
    enabled: boolean;
    phone?: string;
    deadline?: string;
    submissions: RsvpSubmission[];
  };
  blessingsWall: {
    enabled: boolean;
    messages: BlessingItem[];
  };
  scratchCard: {
    enabled: boolean;
    secretMessage: string;
  };
  musicUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
