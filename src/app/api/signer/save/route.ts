import { NextRequest, NextResponse } from 'next/server';

const UPSTASH_REST_URL = process.env.UPSTASH_REST_URL;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REST_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { fid, signerUuid } = await req.json();
    if (!fid || !signerUuid) {
      return NextResponse.json({ error: 'Missing fid or signerUuid' }, { status: 400 });
    }
    if (!UPSTASH_REST_URL || !UPSTASH_REST_TOKEN) {
      return NextResponse.json({ error: 'Upstash env vars not set' }, { status: 500 });
    }
    const key = `signer:${fid}`;
    const upstashRes = await fetch(`${UPSTASH_REST_URL}/set/${key}/${signerUuid}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (!upstashRes.ok) {
      const err = await upstashRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 