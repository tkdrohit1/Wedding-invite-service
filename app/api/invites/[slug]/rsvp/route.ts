import { NextResponse } from 'next/server';
import { addRsvp } from '@/lib/storage';

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    if (!body.guestName) {
      return NextResponse.json({ success: false, error: 'Guest name is required' }, { status: 400 });
    }

    const rsvp = await addRsvp(slug, {
      guestName: body.guestName,
      attending: body.attending !== false,
      guestCount: Number(body.guestCount) || 1,
      message: body.message || '',
    });

    if (!rsvp) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rsvp });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
