import type { GalleryItem } from '@/types/cms';
import { optimizeImageUrl, optimizeVideoUrl } from '@/lib/cloudinary';

type GalleryWallProps = {
  items: GalleryItem[];
};

function mediaSrc(url: string, type: 'image' | 'video') {
  if (type === 'image') return optimizeImageUrl(url, 800);
  return optimizeVideoUrl(url);
}

export default function GalleryWall({ items }: GalleryWallProps) {
  return (
    <>
      <section className="page-hero page-hero--media">
        <div
          className="page-hero-bg"
          style={{
            backgroundImage: "url('/assets/images/events/wedding-01.jpg')",
            backgroundPosition: 'center center'
          }}
        />
        <div
          className="page-hero-overlay"
          style={{
            background:
              'linear-gradient(180deg, rgba(28,28,28,0.5) 0%, rgba(28,28,28,0.4) 50%, rgba(28,28,28,0.75) 100%)'
          }}
        />
        <div className="container">
          <span className="section-label reveal">Our Work</span>
          <h1>Gallery</h1>
          <p className="section-subtitle mx-auto reveal" style={{ marginTop: 16 }}>
            Moments we&apos;ve crafted — weddings, corporate events, concerts, and more.
          </p>
        </div>
      </section>

      <section className="section portfolio-section gallery-section">
        <div className="container">
          <div className="gallery-wall">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="gallery-item gallery-item--pure reveal"
                  data-lightbox
                  data-category={item.category ?? ''}
                >
                  {item.media_type === 'video' ? (
                    <video
                      src={mediaSrc(item.media_url, 'video')}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                      poster={item.thumbnail_url ?? undefined}
                      aria-label={item.title || 'Event video'}
                    />
                  ) : (
                    <img
                      src={mediaSrc(item.media_url, 'image')}
                      alt={item.title || ''}
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="reveal" style={{ color: 'rgba(250,247,242,0.7)' }}>
                Gallery content will appear here once added from the admin dashboard.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
