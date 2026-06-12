export const BLOG_CATEGORIES = [
  { slug: 'wedding', label: 'Wedding Planning' },
  { slug: 'corporate', label: 'Corporate Events' },
  { slug: 'artist', label: 'Artist Management' },
  { slug: 'concert', label: 'Concerts' },
  { slug: 'exhibition', label: 'Exhibitions' },
  { slug: 'tips', label: 'Event Tips' }
] as const;

export const GALLERY_CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'wedding', label: 'Weddings' },
  { slug: 'corporate', label: 'Corporate' },
  { slug: 'concert', label: 'Concerts' },
  { slug: 'exhibition', label: 'Exhibitions' }
] as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.kraftinentertainment.com';

export function categoryLabel(slug: string | null | undefined): string {
  if (!slug) return '';
  const match = BLOG_CATEGORIES.find((c) => c.slug === slug || c.label === slug);
  return match?.label ?? slug;
}

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
