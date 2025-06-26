import { NextRequest, NextResponse } from 'next/server';
import neynarClient from "@/clients/neynar";
import { put } from '@vercel/blob';

// curl -X POST http://localhost:4500/i/12345 \
//   -H "Content-Type: multipart/form-data" \
//   -F 'payload_json={"message": "Hello from API", "user_id": 12345, "timestamp": "2025-06-26T10:30:00Z", "metadata": {"source": "curl", "version": "1.0"}}; type=application/json' \
//   -F 'file=@/Users/johns/Documents/osrs-farcaster-bot/osrs-farcaster-bot-logo.png; filename=screenshot.png; type=image/png'

export async function POST(req: NextRequest, { params }: { params: { signer_uuid: string } }) {
  console.log('[POST /i/[signer_uuid]] Handler invoked');
  console.log('Params:', params);
  try {
    const formData = await req.formData();
    console.log('FormData keys:', Array.from(formData.keys()));
    const payloadJsonStr = formData.get('payload_json');
    console.log('payload_json (raw):', payloadJsonStr);
    if (!payloadJsonStr || typeof payloadJsonStr !== 'string') {
      console.error('Missing or invalid payload_json');
      return NextResponse.json({ error: 'Missing or invalid payload_json' }, { status: 400 });
    }
    let payload;
    try {
      payload = JSON.parse(payloadJsonStr);
      console.log('Parsed payload_json:', payload);
    } catch (e) {
      console.error('Invalid JSON in payload_json:', e);
      return NextResponse.json({ error: 'Invalid JSON in payload_json' }, { status: 400 });
    }

    const file = formData.get('file');
    let fileInfo = null;
    let publicImageUrl = null;
    if (file && file instanceof Blob) {
      console.log('File received:', { type: file.type, size: file.size });
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) {
        console.error('File must be PNG or JPEG, got:', file.type);
        return NextResponse.json({ error: 'File must be PNG or JPEG' }, { status: 400 });
      }
      if (file.size > 8 * 1024 * 1024) {
        console.error('File size exceeds 8MB:', file.size);
        return NextResponse.json({ error: 'File size exceeds 8MB' }, { status: 400 });
      }
      fileInfo = {
        type: file.type,
        size: file.size,
      };
      // Upload to Vercel Blob
      const blobResult = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      publicImageUrl = blobResult.url;
      console.log("file uploaded successfully. publicImageUrl", publicImageUrl);
    } else {
      console.log('No file uploaded');
    }

    // Send to Farcaster
    // Call Neynar Cast API

    // Get signer_uuid from params
    const { signer_uuid } = params;

    // For now, use placeholder text - you can customize this based on payload
    let castText = payload.content || "Hello from OSRS Farcaster Bot! 🎮";
    if (payload.type) {
      castText = payload.type + "\n" + castText;
    }

    let hash = null;
    try {
      console.log("signer_uuid", signer_uuid);
      console.log("castText", castText);
      const embedArr = publicImageUrl ? [{ url: publicImageUrl }] : [];
      hash = await neynarClient.publishCast(
        signer_uuid,
        castText,
        {
          embeds: embedArr,
          channelId: "osrs"
        }
      );
      console.log('Cast posted successfully with hash:', hash);
    } catch (castError) {
      console.log("castError", castError);
      console.error('Error posting to Farcaster:', castError);
      return NextResponse.json({
        error: 'Failed to post to Farcaster',
        details: (castError as Error).message
      }, { status: 500 });
    }

    const response = {
      signer_uuid: params.signer_uuid,
      payload,
      file: fileInfo,
      status: 'received',
      farcaster_cast_hash: hash
    };
    console.log('Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 