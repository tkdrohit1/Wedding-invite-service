import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { getInviteBySlug } from '@/lib/storage';

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const invite = await getInviteBySlug(slug);
    if (!invite) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    const scriptPath = path.join(process.cwd(), 'video-engine', 'generator.py');
    const pythonBin = 'C:\\Python314\\python.exe';

    // Launch python script
    const pyProcess = spawn(pythonBin, [scriptPath, slug], {
      cwd: process.cwd(),
    });

    pyProcess.stdout.on('data', (data) => {
      console.log(`[VideoEngine stdout]: ${data}`);
    });

    pyProcess.stderr.on('data', (data) => {
      console.error(`[VideoEngine stderr]: ${data}`);
    });

    return NextResponse.json({
      success: true,
      message: 'Video rendering started',
      videoUrl: `/videos/${slug}.mp4`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
