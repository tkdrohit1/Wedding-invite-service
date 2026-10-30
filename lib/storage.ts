import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import { WeddingInvite, RsvpSubmission, BlessingItem, InviteStatus } from './types';
import { WEDDING_THEMES } from '@/config/themes';

const BUNDLED_DB_PATH = path.join(process.cwd(), 'data', 'invites.json');
const TMP_DB_PATH = path.join(os.tmpdir(), 'eternalvows_invites.json');

// Upstash / Vercel KV Configuration
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'eternalvows_invites_v1';

declare global {
  // eslint-disable-next-line no-var
  var __eternalvows_cache: WeddingInvite[] | undefined;
}

export function getStorageEngine(): 'kv' | 'tmp' | 'local' {
  if (KV_URL && KV_TOKEN) return 'kv';
  if (process.env.VERCEL) return 'tmp';
  return 'local';
}

// Low-level KV helpers using REST API
async function kvGet(key: string): Promise<WeddingInvite[] | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.result === null || data.result === undefined) return null;
    if (typeof data.result === 'string') {
      try {
        return JSON.parse(data.result);
      } catch {
        return null;
      }
    }
    if (Array.isArray(data.result)) {
      return data.result;
    }
    return null;
  } catch (err) {
    console.error('[Storage KV] Read error:', err);
    return null;
  }
}

async function kvSet(key: string, value: WeddingInvite[]): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const valStr = JSON.stringify(value);
    const res = await fetch(`${KV_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', key, valStr]),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    console.error('[Storage KV] Write error:', err);
    return false;
  }
}

// Low-level Local Disk Read
async function readFromDisk(): Promise<WeddingInvite[]> {
  // 1. Try reading from TMP_DB_PATH if it exists
  try {
    if (fsSync.existsSync(TMP_DB_PATH)) {
      const data = await fs.readFile(TMP_DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 2. Try reading bundled data/invites.json
  try {
    if (fsSync.existsSync(BUNDLED_DB_PATH)) {
      const data = await fs.readFile(BUNDLED_DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err: unknown) {
    console.warn('[Storage] Could not read bundled invites.json:', err);
  }

  return [];
}

// Low-level Local Disk Write (Safe for Read-Only Vercel)
async function writeToDisk(invites: WeddingInvite[]): Promise<void> {
  const json = JSON.stringify(invites, null, 2);

  // 1. Always write to /tmp on Vercel or local
  try {
    await fs.writeFile(TMP_DB_PATH, json, 'utf-8');
  } catch (e) {
    console.warn('[Storage] Could not write to tmp:', e);
  }

  // 2. Try writing to BUNDLED_DB_PATH if not running in read-only environment
  if (!process.env.VERCEL) {
    try {
      await fs.mkdir(path.dirname(BUNDLED_DB_PATH), { recursive: true });
      await fs.writeFile(BUNDLED_DB_PATH, json, 'utf-8');
    } catch {
      // Catch EROFS silently on read-only environments
    }
  }
}

// Core Read Function
async function readInvites(): Promise<WeddingInvite[]> {
  // 1. If KV is configured, prioritize KV cloud database
  if (KV_URL && KV_TOKEN) {
    const cloudData = await kvGet(KV_KEY);
    if (Array.isArray(cloudData) && cloudData.length > 0) {
      globalThis.__eternalvows_cache = cloudData;
      return cloudData;
    }

    // First-time seed into KV from bundled file
    const diskSeed = await readFromDisk();
    if (diskSeed.length > 0) {
      await kvSet(KV_KEY, diskSeed);
      globalThis.__eternalvows_cache = diskSeed;
      return diskSeed;
    }
  }

  // 2. Check in-memory cache
  if (globalThis.__eternalvows_cache && globalThis.__eternalvows_cache.length > 0) {
    return globalThis.__eternalvows_cache;
  }

  // 3. Fallback to Disk (TMP or Bundled)
  const diskData = await readFromDisk();
  globalThis.__eternalvows_cache = diskData;
  return diskData;
}

// Core Write Function
async function writeInvites(invites: WeddingInvite[]): Promise<void> {
  globalThis.__eternalvows_cache = invites;

  // 1. If KV is configured, sync to Cloud DB
  if (KV_URL && KV_TOKEN) {
    await kvSet(KV_KEY, invites);
  }

  // 2. Write to disk / tmp
  await writeToDisk(invites);
}

// Webhook notification helper
async function notifyOwner(
  event: 'new_invite' | 'new_rsvp' | 'new_blessing',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<void> {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    let summary = '';
    if (event === 'new_invite') {
      summary = `💍 New Wedding Invite Request: ${data.couple?.groomName} & ${data.couple?.brideName} (${data.themeId})`;
    } else if (event === 'new_rsvp') {
      summary = `💌 New RSVP: ${data.guestName} (${data.guestCount} guests - ${data.attending ? 'Attending' : 'Not Attending'})`;
    } else if (event === 'new_blessing') {
      summary = `💐 New Blessing from ${data.author}: "${data.message}"`;
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: summary,
        text: summary,
        event,
        payload: data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.warn('[Webhook] Could not deliver notification:', err);
  }
}

export async function getAllInvites(): Promise<WeddingInvite[]> {
  return await readInvites();
}

export async function getInviteBySlug(slug: string): Promise<WeddingInvite | null> {
  const invites = await readInvites();
  const found = invites.find(
    (inv) => inv.slug.toLowerCase() === slug.toLowerCase() || inv.id === slug
  );
  return found || null;
}

export async function createInvite(
  inviteData: Omit<WeddingInvite, 'id' | 'createdAt' | 'updatedAt'>
): Promise<WeddingInvite> {
  const invites = await readInvites();
  const id = 'inv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  // Ensure unique slug
  let slug = inviteData.slug || `${inviteData.couple.groomName}-${inviteData.couple.brideName}`;
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let uniqueSlug = slug;
  let counter = 1;
  while (invites.some((i) => i.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  const newInvite: WeddingInvite = {
    ...inviteData,
    status: inviteData.status || 'pending_approval',
    id,
    slug: uniqueSlug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  invites.unshift(newInvite);
  await writeInvites(invites);
  await notifyOwner('new_invite', newInvite);
  return newInvite;
}

export async function updateInviteStatus(
  slug: string,
  status: InviteStatus
): Promise<WeddingInvite | null> {
  const invites = await readInvites();
  const index = invites.findIndex(
    (inv) => inv.slug.toLowerCase() === slug.toLowerCase() || inv.id === slug
  );
  if (index === -1) return null;

  invites[index].status = status;
  invites[index].updatedAt = new Date().toISOString();
  await writeInvites(invites);
  return invites[index];
}

export async function addRsvp(
  slug: string,
  submission: Omit<RsvpSubmission, 'id' | 'submittedAt'>
): Promise<RsvpSubmission | null> {
  const invites = await readInvites();
  const index = invites.findIndex(
    (inv) => inv.slug.toLowerCase() === slug.toLowerCase() || inv.id === slug
  );
  if (index === -1) return null;

  const newRsvp: RsvpSubmission = {
    ...submission,
    id: 'rsvp_' + Date.now().toString(36),
    submittedAt: new Date().toISOString(),
  };

  if (!invites[index].rsvp) {
    invites[index].rsvp = {
      enabled: true,
      submissions: [],
    };
  }
  if (!invites[index].rsvp.submissions) {
    invites[index].rsvp.submissions = [];
  }

  invites[index].rsvp.submissions.push(newRsvp);
  invites[index].updatedAt = new Date().toISOString();
  await writeInvites(invites);
  await notifyOwner('new_rsvp', newRsvp);
  return newRsvp;
}

export async function addBlessing(
  slug: string,
  blessing: Omit<BlessingItem, 'id' | 'createdAt'>
): Promise<BlessingItem | null> {
  const invites = await readInvites();
  const index = invites.findIndex(
    (inv) => inv.slug.toLowerCase() === slug.toLowerCase() || inv.id === slug
  );
  if (index === -1) return null;

  const newBlessing: BlessingItem = {
    ...blessing,
    id: 'bless_' + Date.now().toString(36),
    createdAt: new Date().toISOString(),
  };

  if (!invites[index].blessingsWall) {
    invites[index].blessingsWall = {
      enabled: true,
      messages: [],
    };
  }
  if (!invites[index].blessingsWall.messages) {
    invites[index].blessingsWall.messages = [];
  }

  invites[index].blessingsWall.messages.unshift(newBlessing);
  invites[index].updatedAt = new Date().toISOString();
  await writeInvites(invites);
  await notifyOwner('new_blessing', newBlessing);
  return newBlessing;
}

// Cultural couple name helper for all 70 preview templates
function getSampleCoupleForTheme(themeId: string, series: string) {
  if (themeId.includes('nikah') || themeId.includes('shalimar') || themeId.includes('chikankari')) {
    return {
      groom: 'Zayd Siddiqui',
      groomParents: 'Begum Fatima & Janab Farooq Siddiqui',
      groomCity: 'Hyderabad',
      bride: 'Aaliya Khan',
      brideParents: 'Begum Nasreen & Janab Tariq Khan',
      brideCity: 'Lucknow',
      story: 'Written in the stars and bound by eternal respect and cherished devotion.',
    };
  }
  if (
    themeId.includes('oonjal') ||
    themeId.includes('kanchipuram') ||
    themeId.includes('thirukulam') ||
    themeId.includes('rameswaram') ||
    themeId.includes('chettinad') ||
    themeId.includes('kasavu') ||
    themeId.includes('madurai') ||
    themeId.includes('tirupati')
  ) {
    return {
      groom: 'Karthik Sundaram',
      groomParents: 'Smt. Kalyani & Sri Sundaram Iyer',
      groomCity: 'Chennai',
      bride: 'Meenakshi Ramanathan',
      brideParents: 'Smt. Vidya & Sri Ramanathan Chettiar',
      brideCity: 'Madurai',
      story: 'Two classical music aficionados uniting their journeys in sacred harmony.',
    };
  }
  if (themeId.includes('anand-karaj') || themeId.includes('phulkari') || themeId.includes('golden-temple') || themeId.includes('patiala')) {
    return {
      groom: 'Harpreet Singh',
      groomParents: 'Sardarni Gurpreet Kaur & Sardar Jaswinder Singh',
      groomCity: 'Amritsar',
      bride: 'Simran Dhillon',
      brideParents: 'Sardarni Harjit Kaur & Sardar Manmohan Dhillon',
      brideCity: 'Chandigarh',
      story: 'Blessed with divine grace and surrounded by joyful family traditions.',
    };
  }
  if (themeId.includes('cathedral') || themeId.includes('chapel') || themeId.includes('tuscany') || themeId.includes('parisian')) {
    return {
      groom: 'Alexander Fernandez',
      groomParents: 'Mrs. Maria & Mr. Joseph Fernandez',
      groomCity: 'Goa',
      bride: 'Chloe D’Souza',
      brideParents: 'Mrs. Anita & Mr. Anthony D’Souza',
      brideCity: 'Mumbai',
      story: 'Two hearts beating as one under cathedral arches and starlit vows.',
    };
  }
  if (themeId.includes('alpana') || themeId.includes('kantha')) {
    return {
      groom: 'Anirban Chatterjee',
      groomParents: 'Smt. Sutapa & Sri Subir Chatterjee',
      groomCity: 'Kolkata',
      bride: 'Debolina Mukherjee',
      brideParents: 'Smt. Madhumita & Sri Debabrata Mukherjee',
      brideCity: 'Kolkata',
      story: 'Bound by literature, art, and the sacred sounds of the shankha.',
    };
  }
  if (themeId.includes('paithani') || themeId.includes('warli')) {
    return {
      groom: 'Aditya Deshmukh',
      groomParents: 'Sau. Pratibha & Sri Jayant Deshmukh',
      groomCity: 'Pune',
      bride: 'Tanvi Kulkarni',
      brideParents: 'Sau. Smita & Sri Milind Kulkarni',
      brideCity: 'Mumbai',
      story: 'A celebration woven with royal Paithani silk, laughter, and timeless heritage.',
    };
  }
  // Default Royal North / Pan-India
  return {
    groom: 'Deepak Sharma',
    groomParents: 'Smt. Shanti & Sri Ramesh Sharma',
    groomCity: 'Jaipur',
    bride: 'Pooja Verma',
    brideParents: 'Smt. Sunita & Sri Rajesh Verma',
    brideCity: 'Udaipur',
    story: 'From college library smiles to desert sunsets, stepping into forever together.',
  };
}

/**
 * Seeds all 70 themes as preview invites into the database.
 * Each preview invite is created with status: 'pending_approval'
 * so visitors view them in the restricted 2-screen preview mode!
 */
export async function seedAll70Themes(): Promise<{ added: number; total: number }> {
  const invites = await readInvites();
  let added = 0;

  for (const theme of WEDDING_THEMES) {
    const slug = `demo-${theme.id}`;
    const exists = invites.some((i) => i.slug === slug);

    if (!exists) {
      const sample = getSampleCoupleForTheme(theme.id, theme.series);
      const newInvite: WeddingInvite = {
        id: `demo_inv_${theme.id}`,
        slug,
        themeId: theme.id,
        title: `${sample.groom.split(' ')[0]} & ${sample.bride.split(' ')[0]} Wedding • ${theme.name}`,
        status: 'pending_approval', // Restricted preview mode by default!
        isDemoTemplate: true,
        couple: {
          groomName: sample.groom,
          groomParents: sample.groomParents,
          groomFamilyFrom: sample.groomCity,
          brideName: sample.bride,
          brideParents: sample.brideParents,
          brideFamilyFrom: sample.brideCity,
          heroPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
          ourStory: sample.story,
          storyDate: 'November 28, 2026',
        },
        weddingDate: '2026-11-28T18:00:00.000Z',
        countdownEnabled: true,
        ceremonies: [
          {
            id: 'c1',
            title: 'Haldi & Welcome Celebrations',
            date: 'November 27, 2026',
            time: '10:00 AM',
            venueName: 'The Heritage Courtyard',
            venueAddress: `${sample.groomCity}, India`,
            dressCode: 'Festive Traditional',
            description: 'Auspicious morning with marigold showers, turmeric blessings, and folk songs.',
          },
          {
            id: 'c2',
            title: 'Sangeet & Royal Musical Evening',
            date: 'November 27, 2026',
            time: '07:00 PM',
            venueName: 'The Grand Ballroom',
            venueAddress: `${sample.groomCity}, India`,
            dressCode: 'Glamorous Regal / Tuxedo',
            description: 'Choreographed dances, laughter, and celebratory toasts under chandeliers.',
          },
          {
            id: 'c3',
            title: 'Auspicious Wedding Ceremony & Muhurtham',
            date: 'November 28, 2026',
            time: '05:00 PM',
            venueName: 'Lakeview Palace Mandapam',
            venueAddress: `${sample.groomCity}, India`,
            dressCode: 'Traditional Indian Regal',
            description: 'The sacred holy vows and blessings in eternal companionship.',
          },
        ],
        venue: {
          name: 'The Grand Royal Palace & Resort',
          address: `Palace Road, ${sample.groomCity}, India`,
          mapUrl: `https://maps.google.com/?q=${encodeURIComponent(sample.groomCity + ' Palace')}`,
          landmark: 'Historical Royal Estate',
        },
        rsvp: {
          enabled: true,
          phone: '+91 98765 43210',
          deadline: 'November 15, 2026',
          submissions: [],
        },
        blessingsWall: {
          enabled: true,
          messages: [],
        },
        scratchCard: {
          enabled: true,
          secretMessage: 'Exclusive VIP Access: Join the couple for the After-Party Champagne Toast! 🥂',
        },
        musicUrl: theme.musicUrl,
        videoUrl: `/videos/deepak-and-pooja.mp4`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      invites.push(newInvite);
      added++;
    }
  }

  if (added > 0) {
    await writeInvites(invites);
  }

  return { added, total: invites.length };
}
