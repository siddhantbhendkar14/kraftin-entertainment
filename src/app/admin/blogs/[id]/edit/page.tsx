import { notFound } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogEditor from '@/components/admin/BlogEditor';
import { getBlogById } from '@/lib/cms/blogs';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditBlogPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const blog = await getBlogById(id);
  if (!blog) notFound();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Edit blog</h1>
        {saved ? <div className="admin-notice">Blog saved successfully.</div> : null}
        <BlogEditor blog={blog} />
      </main>
    </div>
  );
}
