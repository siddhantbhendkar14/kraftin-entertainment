import { notFound } from 'next/navigation';
import SiteChrome from '@/components/site/SiteChrome';
import BlogArticleView from '@/components/blog/BlogArticleView';
import { getPublishedBlogBySlug, getRelatedBlogs } from '@/lib/cms/blogs';
import { SITE_URL } from '@/lib/cms/constants';
import type { Metadata } from 'next';
import '../blog-article.css';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) {
    return { title: 'Article not found » Kraftin Entertainment' };
  }

  const title = blog.seo_title || `${blog.title} » Kraftin Entertainment`;
  const description = blog.seo_description || blog.excerpt || '';
  const image = blog.featured_image || `${SITE_URL}/assets/images/hero-wedding.jpg`;
  const url = `${SITE_URL}/blogs/${blog.slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: blog.published_at ?? undefined,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) notFound();

  const related = await getRelatedBlogs(blog);

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featured_image,
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    author: { '@type': 'Organization', name: 'Kraftin Entertainment' },
    publisher: { '@type': 'Organization', name: 'Kraftin Entertainment' },
    mainEntityOfPage: `${SITE_URL}/blogs/${blog.slug}/`
  });

  return (
    <SiteChrome activeNav="blogs" ldJson={ldJson}>
      <main>
        <BlogArticleView blog={blog} related={related} />
      </main>
    </SiteChrome>
  );
}
