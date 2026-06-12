import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const [blogsRes, galleryRes] = await Promise.all([
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true })
  ]);

  const blogCount = blogsRes.error ? 0 : (blogsRes.count ?? 0);
  const galleryCount = galleryRes.error ? 0 : (galleryRes.count ?? 0);

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Dashboard</h1>
        <p>Welcome{user?.email ? `, ${user.email}` : ''}. Content updates publish instantly — no redeploy required.</p>
        <div className="admin-stat-grid">
          <div className="admin-stat">
            <strong>{blogCount ?? 0}</strong>
            <span>Blog posts</span>
          </div>
          <div className="admin-stat">
            <strong>{galleryCount ?? 0}</strong>
            <span>Gallery items</span>
          </div>
          <div className="admin-stat">
            <strong>Live</strong>
            <span>Blog CMS</span>
          </div>
          <div className="admin-stat">
            <strong>Live</strong>
            <span>Gallery CMS</span>
          </div>
        </div>
      </main>
    </div>
  );
}
