'use client';

import { useState } from 'react';

type FeaturedImageUploadProps = {
  defaultValue?: string;
};

export default function FeaturedImageUpload({ defaultValue = '' }: FeaturedImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog');

      const res = await fetch('/api/admin/upload/', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-field">
      <label>Featured image</label>
      {url ? (
        <div className="admin-image-preview">
          <img src={url} alt="Featured preview" />
        </div>
      ) : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        disabled={uploading}
      />
      <input type="hidden" name="featured_image" value={url} />
      <input
        type="url"
        className="admin-input-inline"
        placeholder="Or paste image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {uploading ? <p className="admin-hint">Uploading…</p> : null}
      {error ? <p className="admin-inline-error">{error}</p> : null}
    </div>
  );
}
