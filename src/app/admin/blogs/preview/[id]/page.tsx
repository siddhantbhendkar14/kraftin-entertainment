import { notFound, redirect } from 'next/navigation';
import SiteChrome from '@/components/site/SiteChrome';
import BlogArticleView from '@/components/blog/BlogArticleView';
import { AuthError, requireAdmin } from '@/lib/auth/admin';
import { getBlogById, getRelatedBlogs } from '@/lib/cms/blogs';
import '@/app/blogs/blog-article.css';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogPreviewPage({ params }: PageProps) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AuthError) redirect('/admin/login/');
    throw e;
  }
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) notFound();

  const related =
    blog.status === 'published' ? await getRelatedBlogs(blog) : [];

  return (
    <SiteChrome activeNav="blogs">
      <main>
        <BlogArticleView blog={blog} related={related} preview />
      </main>
    </SiteChrome>
  );
}
