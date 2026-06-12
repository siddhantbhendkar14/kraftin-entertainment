import type { BlogFormInput, BlogStatus } from '@/types/cms';
import { BLOG_CATEGORIES } from '@/lib/cms/constants';
import { slugify } from '@/lib/cms/slug';

const MAX_TITLE = 200;
const MAX_SLUG = 200;
const MAX_EXCERPT = 500;
const MAX_SEO_TITLE = 70;
const MAX_SEO_DESC = 160;
const MAX_CONTENT = 100_000;

const validCategories = new Set(BLOG_CATEGORIES.map((c) => c.slug));

export type BlogValidationResult =
  | { ok: true; data: BlogFormInput }
  | { ok: false; error: string };

export function parseBlogForm(formData: FormData): BlogValidationResult {
  const title = String(formData.get('title') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? title));
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const featured_image = String(formData.get('featured_image') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const tagsRaw = String(formData.get('tags') ?? '').trim();
  const seo_title = String(formData.get('seo_title') ?? '').trim();
  const seo_description = String(formData.get('seo_description') ?? '').trim();
  const status = String(formData.get('status') ?? 'draft') as BlogStatus;

  if (!title) return { ok: false, error: 'Title is required.' };
  if (title.length > MAX_TITLE) return { ok: false, error: 'Title is too long.' };
  if (!slug) return { ok: false, error: 'Slug is required.' };
  if (slug.length > MAX_SLUG) return { ok: false, error: 'Slug is too long.' };
  if (!content) return { ok: false, error: 'Content is required.' };
  if (content.length > MAX_CONTENT) return { ok: false, error: 'Content is too long.' };
  if (excerpt.length > MAX_EXCERPT) return { ok: false, error: 'Excerpt is too long.' };
  if (seo_title.length > MAX_SEO_TITLE) return { ok: false, error: 'SEO title is too long.' };
  if (seo_description.length > MAX_SEO_DESC) return { ok: false, error: 'SEO description is too long.' };
  if (category && !validCategories.has(category as (typeof BLOG_CATEGORIES)[number]['slug'])) {
    return { ok: false, error: 'Invalid category.' };
  }
  if (status !== 'draft' && status !== 'published') {
    return { ok: false, error: 'Invalid status.' };
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      tags: tagsRaw,
      seo_title,
      seo_description,
      status
    }
  };
}

export function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}
