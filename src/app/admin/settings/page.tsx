import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminSettingsPage() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>Settings</h1>
        <p>Account and integration settings will be available in a future phase.</p>
      </main>
    </div>
  );
}
