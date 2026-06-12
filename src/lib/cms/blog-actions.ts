'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { ensureUniqueSlug } from '@/lib/cms/slug';
import { parseBlogForm, parseTags } from '@/lib/validation/blog';
import { isNextNavigationError } from '@/lib/navigation-error';
import { sanitizeBlogHtml } from '@/lib/sanitize-html';

export type ActionState = { error?: string; success?: string } | null;

async function slugExists(slug: string, excludeId?: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('blogs').select('id').eq('slug', slug).maybeSingle();
  if (!data) return false;
  if (excludeId && data.id === excludeId) return false;
  return true;
}

export async function saveBlogAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = parseBlogForm(formData);
    if (!parsed.ok) return { error: parsed.error };

    const id = String(formData.get('id') ?? '').trim() || null;
    const { data } = parsed;
    const uniqueSlug = await ensureUniqueSlug(data.slug, (s) => slugExists(s, id ?? undefined));

    const payload = {
      title: data.title,
      slug: uniqueSlug,
      excerpt: data.excerpt || null,
      content: sanitizeBlogHtml(data.content),
      featured_image: data.featured_image || null,
      category: data.category || null,
      tags: parseTags(data.tags),
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      status: data.status,
      published_at:
        data.status === 'published'
          ? formData.get('published_at')
            ? String(formData.get('published_at'))
            : new Date().toISOString()
          : null
    };

    if (id) {
      const { error } = await supabase.from('blogs').update(payload).eq('id', id);
      if (error) return { error: error.message };
      revalidatePath('/blogs');
      revalidatePath(`/blogs/${uniqueSlug}`);
      redirect(`/admin/blogs/${id}/edit/?saved=1`);
    }

    const { data: created, error } = await supabase.from('blogs').insert(payload).select('id').single();
    if (error) return { error: error.message };

    revalidatePath('/blogs');
    redirect(`/admin/blogs/${created.id}/edit/?saved=1`);
  } catch (e) {
    if (isNextNavigationError(e)) throw e;
    return { error: e instanceof Error ? e.message : 'Failed to save blog.' };
  }
}

export async function deleteBlogAction(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');
    return { success: 'Blog deleted.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to delete blog.' };
  }
}

export async function toggleBlogStatusAction(id: string, status: 'draft' | 'published'): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { data: blog } = await supabase.from('blogs').select('slug, published_at').eq('id', id).single();
    if (!blog) return { error: 'Blog not found.' };

    const { error } = await supabase
      .from('blogs')
      .update({
        status,
        published_at:
          status === 'published' ? blog.published_at ?? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${blog.slug}`);
    revalidatePath('/admin/blogs');
    return { success: status === 'published' ? 'Published.' : 'Unpublished.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update status.' };
  }
}
