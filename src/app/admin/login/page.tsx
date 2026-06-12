import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage blog and gallery content.</p>
        <LoginForm />
      </div>
    </div>
  );
}
