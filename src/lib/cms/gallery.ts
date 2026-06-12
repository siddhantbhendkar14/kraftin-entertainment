import { createClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/types/cms';

export async function getVisibleGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as GalleryItem[];
}

export async function getAdminGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as GalleryItem[];
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return data as GalleryItem;
}

export async function getNextGalleryOrder(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.display_order ?? -1) + 1;
}
