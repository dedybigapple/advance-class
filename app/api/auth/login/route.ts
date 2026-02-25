import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.CLASSROOM_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  setSessionCookie();
  return NextResponse.json({ ok: true });
}
