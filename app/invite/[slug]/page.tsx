import { notFound } from 'next/navigation';
import { getInviteBySlug } from '@/lib/storage';
import { getThemeById, WEDDING_THEMES } from '@/config/themes';
import { getDemoInviteForTheme } from '@/lib/demoData';
import { InviteClient } from './InviteClient';
import type { Metadata } from 'next';

interface InvitePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; admin?: string }>;
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Check if it's a demo theme preview slug
  const normalizedThemeId = slug.replace(/^demo-/, '');
  const theme = getThemeById(normalizedThemeId);

  if (theme) {
    const demoInvite = getDemoInviteForTheme(theme);
    return {
      title: `${demoInvite.couple.groomName} & ${demoInvite.couple.brideName} • ${theme.name} Wedding`,
      description: `Preview the luxury ${theme.name} digital wedding invitation pattern.`,
    };
  }

  const invite = await getInviteBySlug(slug);
  if (!invite) {
    return { title: 'Invitation Not Found' };
  }

  return {
    title: invite.title || `${invite.couple.groomName} & ${invite.couple.brideName} Wedding`,
    description: `You are cordially invited to celebrate the wedding of ${invite.couple.groomName} & ${invite.couple.brideName}.`,
    openGraph: {
      title: invite.title,
      description: `Wedding celebration of ${invite.couple.groomName} & ${invite.couple.brideName}`,
      images: invite.couple.heroPhoto ? [invite.couple.heroPhoto] : [],
    },
  };
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { slug } = await params;
  const { to, admin } = await searchParams;
  const isAdminBypass = admin === '1' || admin === 'true';

  // 1. Check if the user is previewing ANY of the 70 themes (e.g. /invite/demo-udaipur-pichwai or /invite/demo-nikah-noor)
  const normalizedThemeId = slug.replace(/^demo-/, '');
  const theme = getThemeById(normalizedThemeId);

  if (theme && (slug.startsWith('demo-') || !slug.includes('-and-'))) {
    // Generate the bespoke, uniquely styled 2-screen preview invitation for this exact theme!
    const demoInvite = getDemoInviteForTheme(theme);

    return (
      <InviteClient
        invite={demoInvite}
        theme={theme}
        guestName={to}
        isAdminBypass={isAdminBypass}
      />
    );
  }

  // 2. Otherwise load custom user invitation from storage
  const invite = await getInviteBySlug(slug);
  if (!invite) {
    // If not found in storage, check if slug directly matches a theme
    if (theme) {
      const demoInvite = getDemoInviteForTheme(theme);
      return (
        <InviteClient
          invite={demoInvite}
          theme={theme}
          guestName={to}
          isAdminBypass={isAdminBypass}
        />
      );
    }
    notFound();
  }

  const inviteTheme = getThemeById(invite.themeId) || WEDDING_THEMES[0];

  return (
    <InviteClient
      invite={invite}
      theme={inviteTheme}
      guestName={to}
      isAdminBypass={isAdminBypass}
    />
  );
}
