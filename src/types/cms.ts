export type BlogStatus = 'draft' | 'published';
export type MediaType = 'image' | 'video';

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  status: BlogStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  cloudinary_id: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
};

export type BlogFormInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string;
  seo_title: string;
  seo_description: string;
  status: BlogStatus;
};

export type GalleryFormInput = {
  title: string;
  category: string;
  is_visible: boolean;
};
