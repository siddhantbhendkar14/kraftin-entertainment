import { NextResponse } from 'next/server';
import { AuthError, requireAdmin } from '@/lib/auth/admin';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';
import { validateUpload } from '@/lib/validation/upload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    await requireAdmin();

    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') ?? 'kraftin').trim() || 'kraftin';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const validation = validateUpload(file);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, {
      folder: folder === 'blog' ? 'kraftin/blog' : 'kraftin/gallery',
      resourceType: validation.kind === 'video' ? 'video' : 'image'
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      media_type: validation.kind,
      thumbnail_url: result.thumbnail_url ?? null
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed.' },
      { status: 500 }
    );
  }
}
