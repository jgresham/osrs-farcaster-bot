import { NextRequest, NextResponse } from 'next/server';

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
      // If you want to process the file, you can use: await file.arrayBuffer()
    } else {
      console.log('No file uploaded');
    }

    const response = {
      signer_uuid: params.signer_uuid,
      payload,
      file: fileInfo,
      status: 'received',
    };
    console.log('Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 