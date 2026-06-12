'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth/actions';

const LINKS = [
  { href: '/admin/dashboard/', label: 'Overview' },
  { href: '/admin/blogs/', label: 'Blog Manager' },
  { href: '/admin/gallery/', label: 'Gallery Manager' },
  { href: '/admin/settings/', label: 'Settings' }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <h2>Kraftin Admin</h2>
      <nav className="admin-nav" aria-label="Admin navigation">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname.startsWith(link.href.replace(/\/$/, '')) ? 'active' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction}>
        <button type="submit" className="admin-logout">
          Log out
        </button>
      </form>
    </aside>
  );
}
