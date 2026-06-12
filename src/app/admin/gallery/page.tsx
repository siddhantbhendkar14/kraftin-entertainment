import AdminSidebar from '@/components/admin/AdminSidebar';
import GalleryManager from '@/components/admin/GalleryManager';
import { getAdminGalleryItems } from '@/lib/cms/gallery';

export default async function AdminGalleryPage() {
  const items = await getAdminGalleryItems();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Gallery Manager</h1>
        <p>Upload, reorder, and manage gallery media. Cloudinary stores files; Supabase stores metadata.</p>
        <GalleryManager items={items} />
      </main>
    </div>
  );
}
