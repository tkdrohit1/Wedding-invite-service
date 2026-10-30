import { NextResponse } from 'next/server';
import { getAllInvites, createInvite, getStorageEngine } from '@/lib/storage';

export async function GET() {
  try {
    const invites = await getAllInvites();
    const storageEngine = getStorageEngine();
    return NextResponse.json({ success: true, invites, storageEngine });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.couple?.groomName || !body.couple?.brideName) {
      return NextResponse.json(
        { success: false, error: 'Groom name and Bride name are required' },
        { status: 400 }
      );
    }

    const created = await createInvite(body);
    return NextResponse.json({ success: true, invite: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
