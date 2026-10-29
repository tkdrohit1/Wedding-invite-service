import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!verifyAdminPassword(pin)) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication request failed' }, { status: 500 });
  }
}
