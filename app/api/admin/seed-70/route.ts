import { NextResponse } from 'next/server';
import { seedAll70Themes } from '@/lib/storage';

const OWNER_PIN = 'admin123';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (pin !== OWNER_PIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const result = await seedAll70Themes();
    return NextResponse.json({
      success: true,
      message: `Seeded ${result.added} new preview invites. Total database invites: ${result.total}.`,
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
