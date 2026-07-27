import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({ ok: true, webhook: 'rd-station', receivedAt: new Date().toISOString(), payload });
}
