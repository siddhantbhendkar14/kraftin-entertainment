'use client';

import { useMemo, useState, useTransition } from 'react';
import type { GalleryItem } from '@/types/cms';
import { GALLERY_CATEGORIES } from '@/lib/cms/constants';
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
  reorderGalleryItemsAction,
  toggleGalleryVisibilityAction,
  updateGalleryItemAction
} from '@/lib/cms/gallery-actions';
import { useActionState } from 'react';

type GalleryManagerProps = {
  items: GalleryItem[];
};

export default function GalleryManager({ items: initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    setMessage('');

    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');

        const res = await fetch('/api/admin/upload/', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);

        const created = await createGalleryItemAction({
          title: file.name.replace(/\.[^.]+$/, ''),
          category: '',
          media_type: data.media_type,
          media_url: data.url,
          thumbnail_url: data.thumbnail_url ?? undefined,
          cloudinary_id: data.public_id
        });

        if (created.error) throw new Error(created.error);
      }
      setMessage('Upload complete.');
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function moveItem(id: string, direction: -1 | 1) {
    const index = items.findIndex((i) => i.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;

    const next = [...items];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed);
    setItems(next);

    startTransition(async () => {
      const result = await reorderGalleryItemsAction(next.map((i) => i.id));
      setMessage(result?.error ?? result?.success ?? '');
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm('Delete this gallery item?')) return;
    startTransition(async () => {
      const result = await deleteGalleryItemAction(id);
      if (!result?.error) setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage(result?.error ?? result?.success ?? '');
    });
  }

  function handleVisibility(id: string, is_visible: boolean) {
    startTransition(async () => {
      const result = await toggleGalleryVisibilityAction(id, is_visible);
      if (!result?.error) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_visible } : i)));
      }
      setMessage(result?.error ?? result?.success ?? '');
    });
  }

  return (
    <>
      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter gallery">
          {GALLERY_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
        <label className="admin-upload-btn">
          {uploading ? 'Uploading…' : 'Upload media'}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            hidden
            disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </label>
      </div>

      {message ? <div className="admin-notice">{message}</div> : null}
      {pending ? <p className="admin-hint">Saving…</p> : null}

      <div className="admin-gallery-grid">
        {filtered.length ? (
          filtered.map((item) => {
            const fullIndex = items.findIndex((i) => i.id === item.id);
            return (
            <GalleryItemCard
              key={item.id}
              item={item}
              index={fullIndex}
              total={items.length}
              editing={editingId === item.id}
              onEdit={() => setEditingId(editingId === item.id ? null : item.id)}
              onDelete={() => handleDelete(item.id)}
              onMoveUp={() => moveItem(item.id, -1)}
              onMoveDown={() => moveItem(item.id, 1)}
              onToggleVisibility={() => handleVisibility(item.id, !item.is_visible)}
            />
          );
          })
        ) : (
          <p>No gallery items yet. Upload images or videos to get started.</p>
        )}
      </div>
    </>
  );
}

type GalleryItemCardProps = {
  item: GalleryItem;
  index: number;
  total: number;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
};

function GalleryItemCard({
  item,
  index,
  total,
  editing,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleVisibility
}: GalleryItemCardProps) {
  const [state, formAction] = useActionState(updateGalleryItemAction, null);

  return (
    <div className={`admin-gallery-card ${!item.is_visible ? 'is-hidden' : ''}`}>
      <div className="admin-gallery-preview">
        {item.media_type === 'video' ? (
          <video src={item.media_url} muted playsInline preload="metadata" poster={item.thumbnail_url ?? undefined} />
        ) : (
          <img src={item.thumbnail_url || item.media_url} alt={item.title} />
        )}
      </div>
      <div className="admin-gallery-meta">
        <strong>{item.title || 'Untitled'}</strong>
        <span>{item.media_type}</span>
        {!item.is_visible ? <span className="admin-badge admin-badge--draft">Hidden</span> : null}
      </div>
      <div className="admin-gallery-actions">
        <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label="Move up">
          ↑
        </button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label="Move down">
          ↓
        </button>
        <button type="button" onClick={onToggleVisibility}>
          {item.is_visible ? 'Hide' : 'Show'}
        </button>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>

      {editing ? (
        <form className="admin-gallery-edit" action={formAction}>
          <input type="hidden" name="id" value={item.id} />
          {state?.error ? <div className="admin-error">{state.error}</div> : null}
          {state?.success ? <div className="admin-notice">{state.success}</div> : null}
          <input name="title" defaultValue={item.title} placeholder="Title" />
          <select name="category" defaultValue={item.category ?? ''}>
            <option value="">No category</option>
            {GALLERY_CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
          <select name="is_visible" defaultValue={item.is_visible ? 'true' : 'false'}>
            <option value="true">Visible on website</option>
            <option value="false">Hidden</option>
          </select>
          <button type="submit" className="admin-btn admin-btn-inline">
            Save metadata
          </button>
        </form>
      ) : null}
    </div>
  );
}
