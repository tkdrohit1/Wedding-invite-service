import { NextResponse } from 'next/server';
import { updateInviteStatus, getInviteBySlug } from '@/lib/storage';
import { spawn } from 'child_process';
import path from 'path';

const OWNER_PIN = 'admin123';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (pin !== OWNER_PIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const updated = await updateInviteStatus(slug, 'approved');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    // Launch python video generator in background
    const scriptPath = path.join(process.cwd(), 'video-engine', 'generator.py');
    const pythonBin = 'C:\\Python314\\python.exe';

    try {
      const py = spawn(pythonBin, [scriptPath, slug], { cwd: process.cwd() });
      py.stdout.on('data', (d) => console.log(`[VideoEngine stdout]: ${d}`));
      py.stderr.on('data', (d) => console.error(`[VideoEngine stderr]: ${d}`));
    } catch (e) {
      console.error('Failed to spawn python video generator:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation approved! Video rendering initiated.',
      invite: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
