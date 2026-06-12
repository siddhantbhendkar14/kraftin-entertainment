import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogManager from '@/components/admin/BlogManager';
import { getAdminBlogs } from '@/lib/cms/blogs';

export default async function AdminBlogsPage() {
  const blogs = await getAdminBlogs();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Blog Manager</h1>
        <p>Create, edit, publish, and manage blog articles. Changes appear on the website instantly.</p>
        <BlogManager blogs={blogs} />
      </main>
    </div>
  );
}
