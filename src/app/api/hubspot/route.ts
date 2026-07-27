import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json();
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const formId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;
  if (!portalId || !formId) return NextResponse.json({ ok: true, skipped: 'HubSpot env vars not configured', payload });
  return NextResponse.json({ ok: true, integration: 'hubspot-prepared', portalId, formId });
}
