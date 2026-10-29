import { NextResponse } from 'next/server';
import { addBlessing } from '@/lib/storage';

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    if (!body.author || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name and blessing message are required' },
        { status: 400 }
      );
    }

    const blessing = await addBlessing(slug, {
      author: body.author,
      message: body.message,
    });

    if (!blessing) {
      return NextResponse.json({ success: false, error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blessing });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
