import SiteChrome from '@/components/site/SiteChrome';
import '../blog-article.css';

export default function BlogsLoading() {
  return (
    <SiteChrome activeNav="blogs">
      <main>
        <section className="page-hero page-hero--media">
          <div className="page-hero-overlay" />
          <div className="container">
            <span className="section-label">Insights &amp; Stories</span>
            <h1>BLOGS</h1>
          </div>
        </section>
        <section className="section">
          <div className="container blog-loading-grid">
            <div className="blog-loading-card" />
            <div className="blog-loading-card" />
            <div className="blog-loading-card" />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
