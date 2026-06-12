'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { Blog } from '@/types/cms';
import { BLOG_CATEGORIES } from '@/lib/cms/constants';
import { slugify } from '@/lib/cms/slug';
import { saveBlogAction, type ActionState } from '@/lib/cms/blog-actions';
import RichTextEditor from './RichTextEditor';
import FeaturedImageUpload from './FeaturedImageUpload';

type BlogEditorProps = {
  blog?: Blog | null;
};

export default function BlogEditor({ blog }: BlogEditorProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveBlogAction, null);
  const [title, setTitle] = useState(blog?.title ?? '');
  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(blog?.slug));

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form id="blog-editor-form" className="admin-form admin-form-wide" action={formAction}>
      {blog?.id ? <input type="hidden" name="id" value={blog.id} /> : null}
      {blog?.published_at ? <input type="hidden" name="published_at" value={blog.published_at} /> : null}

      {state?.error ? <div className="admin-error">{state.error}</div> : null}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={3} defaultValue={blog?.excerpt ?? ''} />
      </div>

      <div className="admin-field">
        <label>Content</label>
        <RichTextEditor
          name="content"
          defaultValue={blog?.content ?? ''}
          formId="blog-editor-form"
        />
      </div>

      <FeaturedImageUpload defaultValue={blog?.featured_image ?? ''} />

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={blog?.category ?? ''}>
            <option value="">Select category</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" defaultValue={blog?.tags?.join(', ') ?? ''} />
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="seo_title">SEO title</label>
          <input id="seo_title" name="seo_title" defaultValue={blog?.seo_title ?? ''} maxLength={70} />
        </div>
        <div className="admin-field">
          <label htmlFor="seo_description">SEO description</label>
          <input
            id="seo_description"
            name="seo_description"
            defaultValue={blog?.seo_description ?? ''}
            maxLength={160}
          />
        </div>
      </div>

      <div className="admin-field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={blog?.status ?? 'draft'}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="admin-actions-row">
        <button type="submit" className="admin-btn admin-btn-inline" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
        {blog?.id ? (
          <Link href={`/admin/blogs/preview/${blog.id}/`} className="admin-btn-secondary" target="_blank">
            Preview
          </Link>
        ) : null}
        <Link href="/admin/blogs/" className="admin-btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
