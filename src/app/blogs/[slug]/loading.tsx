import SiteChrome from '@/components/site/SiteChrome';
import '../blog-article.css';

export default function BlogArticleLoading() {
  return (
    <SiteChrome activeNav="blogs">
      <main>
        <section className="page-hero page-hero--media">
          <div className="page-hero-overlay" />
          <div className="container">
            <div className="blog-loading-card" style={{ height: 48, marginBottom: 16 }} />
            <div className="blog-loading-card" style={{ height: 64 }} />
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="blog-loading-card" style={{ height: 280 }} />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
