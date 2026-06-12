import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogEditor from '@/components/admin/BlogEditor';

export default function AdminNewBlogPage() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Create blog</h1>
        <BlogEditor />
      </main>
    </div>
  );
}
