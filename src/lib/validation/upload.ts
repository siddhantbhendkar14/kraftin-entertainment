const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export type UploadKind = 'image' | 'video';

export function validateUpload(file: File): { ok: true; kind: UploadKind } | { ok: false; error: string } {
  if (!file || file.size === 0) {
    return { ok: false, error: 'No file provided.' };
  }

  if (IMAGE_TYPES.has(file.type)) {
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: 'Image must be under 10 MB.' };
    }
    return { ok: true, kind: 'image' };
  }

  if (VIDEO_TYPES.has(file.type)) {
    if (file.size > MAX_VIDEO_BYTES) {
      return { ok: false, error: 'Video must be under 100 MB.' };
    }
    return { ok: true, kind: 'video' };
  }

  return { ok: false, error: 'Unsupported file type. Use JPG, PNG, WebP, MP4, or WebM.' };
}
