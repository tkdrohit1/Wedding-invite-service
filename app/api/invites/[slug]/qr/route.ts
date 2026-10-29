import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getInviteBySlug } from '@/lib/storage';

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const invite = await getInviteBySlug(slug);
    if (!invite) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const inviteUrl = `${protocol}://${host}/invite/${invite.slug}`;

    const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#2A0808',
        light: '#FFFDF9',
      },
      errorCorrectionLevel: 'H',
    });

    return NextResponse.json({
      success: true,
      qrDataUrl,
      inviteUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
