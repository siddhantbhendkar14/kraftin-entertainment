import Link from 'next/link';
import type { Blog } from '@/types/cms';
import { BLOG_CATEGORIES, categoryLabel, formatBlogDate } from '@/lib/cms/constants';

type BlogListingProps = {
  blogs: Blog[];
};

const FALLBACK_IMAGE = '/assets/images/blog/wedding-trends.jpg';

export default function BlogListing({ blogs }: BlogListingProps) {
  const featured = blogs[0] ?? null;
  const gridPosts = featured ? blogs.slice(1) : blogs;

  return (
    <>
      <section className="page-hero page-hero--media">
        <div
          className="page-hero-bg"
          style={{ backgroundImage: "url('/assets/images/blog/blog-hero.jpg')" }}
        />
        <div className="page-hero-overlay" />
        <div className="container">
          <span className="section-label reveal">Insights &amp; Stories</span>
          <h1>BLOGS</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-featured">
            {featured ? (
              <Link href={`/blogs/${featured.slug}/`} className="blog-featured-card reveal">
                <div
                  className="blog-featured-bg"
                  style={{
                    backgroundImage: `url('${featured.featured_image || FALLBACK_IMAGE}')`
                  }}
                />
                <div className="blog-featured-content">
                  <span className="blog-category">{categoryLabel(featured.category) || 'Featured'}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <span className="blog-card-meta">{formatBlogDate(featured.published_at)}</span>
                </div>
              </Link>
            ) : (
              <article className="blog-featured-card reveal">
                <div
                  className="blog-featured-bg"
                  style={{ backgroundImage: "url('/assets/images/blog/wedding-featured.jpg')" }}
                />
                <div className="blog-featured-content">
                  <span className="blog-category">Featured</span>
                  <h2>Insights from Kraftin Entertainment</h2>
                  <p>New articles will appear here once published from the admin dashboard.</p>
                </div>
              </article>
            )}

            <aside className="blog-sidebar reveal">
              <div className="blog-search">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  id="blog-search"
                  placeholder="Search articles..."
                  aria-label="Search blog articles"
                />
              </div>
              <div className="blog-categories">
                <h3>Categories</h3>
                <ul>
                  <li data-category="all">All Articles</li>
                  {BLOG_CATEGORIES.map((cat) => (
                    <li key={cat.slug} data-category={cat.slug}>
                      {cat.label}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="blog-grid">
            {gridPosts.length > 0 ? (
              gridPosts.map((post) => (
                <Link key={post.id} href={`/blogs/${post.slug}/`} className="blog-card reveal">
                  <div
                    className="blog-card-image"
                    style={{
                      backgroundImage: `url('${post.featured_image || FALLBACK_IMAGE}')`
                    }}
                  />
                  <div className="blog-card-content">
                    <span className="blog-category">{categoryLabel(post.category)}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="blog-card-meta">{formatBlogDate(post.published_at)}</span>
                  </div>
                </Link>
              ))
            ) : (
              !featured && (
                <p className="reveal" style={{ gridColumn: '1 / -1', color: 'rgba(250,247,242,0.7)' }}>
                  No published articles yet. Check back soon.
                </p>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
