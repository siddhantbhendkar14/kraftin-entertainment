import { NextResponse } from 'next/server';
import { AuthError } from '@/lib/auth/admin';
import { reorderGalleryItemsAction } from '@/lib/cms/gallery-actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderedIds = body?.orderedIds;

    if (!Array.isArray(orderedIds) || !orderedIds.every((id) => typeof id === 'string')) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    const result = await reorderGalleryItemsAction(orderedIds);
    if (!result || result.error) {
      return NextResponse.json({ error: result?.error ?? 'Reorder failed.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: 'Reorder failed.' }, { status: 500 });
  }
}
