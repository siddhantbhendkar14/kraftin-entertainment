'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Blog } from '@/types/cms';
import { BLOG_CATEGORIES, categoryLabel, formatBlogDate } from '@/lib/cms/constants';
import { deleteBlogAction, toggleBlogStatusAction } from '@/lib/cms/blog-actions';

type BlogManagerProps = {
  blogs: Blog[];
};

export default function BlogManager({ blogs }: BlogManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter((blog) => {
      if (status !== 'all' && blog.status !== status) return false;
      if (category !== 'all' && blog.category !== category) return false;
      if (!q) return true;
      return (
        blog.title.toLowerCase().includes(q) ||
        blog.slug.toLowerCase().includes(q) ||
        (blog.excerpt ?? '').toLowerCase().includes(q)
      );
    });
  }, [blogs, search, status, category]);

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    startTransition(async () => {
      const result = await deleteBlogAction(id);
      setMessage(result?.error ?? result?.success ?? '');
      if (!result?.error) router.refresh();
    });
  }

  function handleToggle(id: string, next: 'draft' | 'published') {
    startTransition(async () => {
      const result = await toggleBlogStatusAction(id, next);
      setMessage(result?.error ?? result?.success ?? '');
      if (!result?.error) router.refresh();
    });
  }

  return (
    <>
      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search blogs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search blogs"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {BLOG_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
        <Link href="/admin/blogs/new/" className="admin-btn admin-btn-inline">
          + New blog
        </Link>
      </div>

      {message ? <div className="admin-notice">{message}</div> : null}
      {pending ? <p className="admin-hint">Updating…</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <strong>{blog.title}</strong>
                    <span className="admin-table-sub">/{blog.slug}/</span>
                  </td>
                  <td>{categoryLabel(blog.category)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${blog.status}`}>{blog.status}</span>
                  </td>
                  <td>{formatBlogDate(blog.updated_at)}</td>
                  <td className="admin-table-actions">
                    <Link href={`/admin/blogs/${blog.id}/edit/`}>Edit</Link>
                    <Link href={`/admin/blogs/preview/${blog.id}/`} target="_blank">
                      Preview
                    </Link>
                    {blog.status === 'published' ? (
                      <button type="button" onClick={() => handleToggle(blog.id, 'draft')}>
                        Unpublish
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleToggle(blog.id, 'published')}>
                        Publish
                      </button>
                    )}
                    <button type="button" className="danger" onClick={() => handleDelete(blog.id, blog.title)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
