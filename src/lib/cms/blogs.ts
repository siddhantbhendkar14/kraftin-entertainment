import { createClient } from '@/lib/supabase/server';
import type { Blog } from '@/types/cms';

export async function getPublishedBlogs(): Promise<Blog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Blog[];
}

export async function getPublishedBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  return data as Blog;
}

export async function getRelatedBlogs(blog: Blog, limit = 3): Promise<Blog[]> {
  const supabase = await createClient();
  let query = supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .neq('id', blog.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (blog.category) {
    query = query.eq('category', blog.category);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Blog[];
}

export async function getAdminBlogs(filters?: {
  search?: string;
  status?: string;
  category?: string;
}): Promise<Blog[]> {
  const supabase = await createClient();
  let query = supabase.from('blogs').select('*').order('updated_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;
  if (error) return [];

  let rows = (data ?? []) as Blog[];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.excerpt ?? '').toLowerCase().includes(q)
    );
  }
  return rows;
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as Blog;
}
