import Link from 'next/link';
import SiteChrome from '@/components/site/SiteChrome';

export default function BlogNotFound() {
  return (
    <SiteChrome activeNav="blogs">
      <main>
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="section-label reveal">Blog</span>
            <h1 className="section-title reveal">Article not found</h1>
            <p className="section-subtitle mx-auto reveal">
              This article may have been removed or is not yet published.
            </p>
            <Link href="/blogs/" className="btn btn-primary reveal" style={{ marginTop: 24 }}>
              Back to blogs
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
