import fs from 'fs/promises';
import path from 'path';
import { WeddingInvite, RsvpSubmission, BlessingItem, InviteStatus } from './types';
import { WEDDING_THEMES } from '@/config/themes';

const DB_PATH = path.join(process.cwd(), 'data', 'invites.json');

async function readInvites(): Promise<WeddingInvite[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, '[]', 'utf-8');
      return [];
    }
    console.error('Error reading invites db:', err);
    return [];
  }
}

async function writeInvites(invites: WeddingInvite[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(invites, null, 2), 'utf-8');
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
