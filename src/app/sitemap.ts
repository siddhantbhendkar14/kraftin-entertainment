import type { MetadataRoute } from 'next';
import { getPublishedBlogs } from '@/lib/cms/blogs';
import { SITE_URL } from '@/lib/cms/constants';

const STATIC_ROUTES = [
  '',
  'about-us/',
  'our-mentors/',
  'our-artists/',
  'blogs/',
  'gallery/',
  'contact-us/',
  'privacy-policy/',
  'case-studies/varmala/'
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogs();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === 'blogs/' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === 'contact-us/' ? 0.9 : 0.7
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blogs/${blog.slug}/`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  return [...staticEntries, ...blogEntries];
}
