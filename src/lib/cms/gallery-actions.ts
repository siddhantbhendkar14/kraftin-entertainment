'use server';

import { revalidatePath } from 'next/cache';
import { AuthError, requireAdmin } from '@/lib/auth/admin';
import { getNextGalleryOrder } from '@/lib/cms/gallery';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { GALLERY_CATEGORIES } from '@/lib/cms/constants';
import type { GalleryFormInput } from '@/types/cms';

export type ActionState = { error?: string; success?: string } | null;

const validCategories = new Set<string>(
  GALLERY_CATEGORIES.filter((c) => c.slug !== 'all').map((c) => c.slug)
);

function parseGalleryForm(formData: FormData): GalleryFormInput | { error: string } {
  const title = String(formData.get('title') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const is_visible = String(formData.get('is_visible') ?? 'true') === 'true';

  if (title.length > 200) return { error: 'Title is too long.' };
  if (category && !validCategories.has(category)) {
    return { error: 'Invalid category.' };
  }

  return { title, category, is_visible };
}

export async function createGalleryItemAction(input: {
  title: string;
  category: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  cloudinary_id?: string;
}): Promise<ActionState & { id?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const display_order = await getNextGalleryOrder();

    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        title: input.title || '',
        category: input.category || null,
        media_type: input.media_type,
        media_url: input.media_url,
        thumbnail_url: input.thumbnail_url ?? null,
        cloudinary_id: input.cloudinary_id ?? null,
        display_order,
        is_visible: true
      })
      .select('id')
      .single();

    if (error) return { error: error.message };
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: 'Media uploaded.', id: data.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create gallery item.' };
  }
}

export async function updateGalleryItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = String(formData.get('id') ?? '').trim();
    if (!id) return { error: 'Missing item id.' };

    const parsed = parseGalleryForm(formData);
    if ('error' in parsed) return { error: parsed.error };

    const { error } = await supabase
      .from('gallery_items')
      .update({
        title: parsed.title,
        category: parsed.category || null,
        is_visible: parsed.is_visible
      })
      .eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: 'Gallery item updated.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update gallery item.' };
  }
}

export async function deleteGalleryItemAction(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { data: item } = await supabase
      .from('gallery_items')
      .select('cloudinary_id, media_type')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) return { error: error.message };

    if (item?.cloudinary_id) {
      try {
        await deleteFromCloudinary(
          item.cloudinary_id,
          item.media_type === 'video' ? 'video' : 'image'
        );
      } catch (err) {
        console.warn('[gallery] Cloudinary delete failed', {
          cloudinary_id: item.cloudinary_id,
          media_type: item.media_type,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: 'Gallery item deleted.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to delete gallery item.' };
  }
}

export async function toggleGalleryVisibilityAction(id: string, is_visible: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from('gallery_items').update({ is_visible }).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: is_visible ? 'Item visible.' : 'Item hidden.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update visibility.' };
  }
}

export async function reorderGalleryItemsAction(orderedIds: string[]): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return { error: 'Invalid order payload.' };
    }

    const updates = orderedIds.map((id, index) =>
      supabase.from('gallery_items').update({ display_order: index }).eq('id', id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) return { error: failed.error.message };

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: 'Order saved.' };
  } catch (e) {
    if (e instanceof AuthError) throw e;
    return { error: e instanceof Error ? e.message : 'Failed to reorder gallery.' };
  }
}
