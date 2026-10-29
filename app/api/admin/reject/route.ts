import { NextResponse } from 'next/server';
import { updateInviteStatus } from '@/lib/storage';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (!verifyAdminPassword(pin)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin Credentials' }, { status: 401 });
    }

    const updated = await updateInviteStatus(slug, 'rejected');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation rejected.',
      invite: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
