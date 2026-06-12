import SiteChrome from '@/components/site/SiteChrome';
import '@/app/blogs/blog-article.css';

export default function GalleryLoading() {
  return (
    <SiteChrome activeNav="gallery" showAmbient showLightbox showWhatsApp>
      <main>
        <section className="page-hero page-hero--media">
          <div className="page-hero-overlay" />
          <div className="container">
            <span className="section-label">Our Work</span>
            <h1>Gallery</h1>
          </div>
        </section>
        <section className="section portfolio-section gallery-section">
          <div className="container">
            <div className="gallery-wall">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="gallery-item gallery-item--pure"
                  style={{
                    minHeight: 220,
                    background: 'linear-gradient(90deg, #1e1e1e 25%, #2a2a2a 50%, #1e1e1e 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'blog-shimmer 1.4s infinite'
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
