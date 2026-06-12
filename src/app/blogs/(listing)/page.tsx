import SiteChrome from '@/components/site/SiteChrome';
import BlogListing from '@/components/blog/BlogListing';
import '../blog-article.css';
import { getPublishedBlogs } from '@/lib/cms/blogs';
import { SITE_URL } from '@/lib/cms/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BLOGS » Kraftin Entertainment',
  description:
    'Kraftin Entertainment blog — insights on weddings, corporate events, artist management, event planning tips, and industry trends across India.',
  alternates: { canonical: `${SITE_URL}/blogs/` },
  openGraph: {
    title: 'BLOGS » Kraftin Entertainment',
    description: 'Event management insights, wedding tips, and industry trends from Kraftin Entertainment.',
    url: `${SITE_URL}/blogs/`,
    images: [`${SITE_URL}/assets/images/hero-wedding.jpg`]
  },
  twitter: {
    card: 'summary',
    title: 'BLOGS » Kraftin Entertainment',
    images: [`${SITE_URL}/assets/images/hero-wedding.jpg`]
  }
};

const blogLdJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Kraftin Entertainment Blog',
  description: 'Event management insights and industry trends',
  url: `${SITE_URL}/blogs/`,
  publisher: { '@type': 'Organization', name: 'Kraftin Entertainment' }
});

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <SiteChrome activeNav="blogs" ldJson={blogLdJson}>
      <main>
        <BlogListing blogs={blogs} />
      </main>
    </SiteChrome>
  );
}
