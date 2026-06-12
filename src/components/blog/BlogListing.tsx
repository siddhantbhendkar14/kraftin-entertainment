import Link from 'next/link';
import type { Blog } from '@/types/cms';
import { BLOG_CATEGORIES, categoryLabel, formatBlogDate } from '@/lib/cms/constants';

type BlogListingProps = {
  blogs: Blog[];
};

const FALLBACK_IMAGE = '/assets/images/blog/wedding-trends.jpg';

const LEGACY_FEATURED = {
  image: '/assets/images/blog/wedding-featured.jpg',
  title: 'The Art of Crafting Extraordinary Wedding Experiences in India',
  excerpt:
    'Discover how premium wedding planning blends tradition with innovation to create unforgettable celebrations.'
};

const LEGACY_PLACEHOLDER_POSTS = [
  {
    image: '/assets/images/blog/wedding-trends.jpg',
    category: 'Wedding Planning',
    title: '5 Trends Shaping Indian Weddings in 2025',
    excerpt:
      "From immersive décor to personalized experiences, explore what's defining modern Indian weddings."
  },
  {
    image: '/assets/images/blog/corporate-events.jpg',
    category: 'Corporate Events',
    title: 'How to Plan a Corporate Event That Leaves a Lasting Impression',
    excerpt: 'Strategic planning tips for corporate gatherings, launches, and brand activations.'
  },
  {
    image: '/assets/images/blog/artist-management.jpg',
    category: 'Artist Management',
    title: 'Choosing the Right Artist for Your Event: A Complete Guide',
    excerpt: "Navigate Kraftin's Pan-India artist network to find the perfect act for your celebration."
  },
  {
    image: '/assets/images/blog/concerts.jpg',
    category: 'Concerts',
    title: 'Behind the Scenes: Producing World-Class Concert Experiences',
    excerpt: 'Sound, SFX, and production excellence — what goes into a memorable live concert.'
  },
  {
    image: '/assets/images/blog/exhibitions.jpg',
    category: 'Exhibitions',
    title: 'Stand Out at Trade Shows: Exhibition Booth Design Tips',
    excerpt: 'Make your brand unforgettable at exhibitions with strategic booth design and engagement.'
  },
  {
    image: '/assets/images/blog/event-tips.jpg',
    category: 'Event Tips',
    title: 'Event Planning Checklist: From Concept to Celebration',
    excerpt: "A comprehensive guide to planning flawless events with Kraftin's end-to-end approach."
  }
] as const;

export default function BlogListing({ blogs }: BlogListingProps) {
  const hasPublishedPosts = blogs.length > 0;
  const featured = hasPublishedPosts ? blogs[0] : null;
  const gridPosts = featured ? blogs.slice(1) : [];

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
                  style={{ backgroundImage: `url('${LEGACY_FEATURED.image}')` }}
                />
                <div className="blog-featured-content">
                  <span className="blog-category">Featured</span>
                  <h2>{LEGACY_FEATURED.title}</h2>
                  <p>{LEGACY_FEATURED.excerpt}</p>
                  <span className="blog-card-meta">Coming Soon</span>
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
              LEGACY_PLACEHOLDER_POSTS.map((post) => (
                <article key={post.title} className="blog-card reveal">
                  <div
                    className="blog-card-image"
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  <div className="blog-card-content">
                    <span className="blog-category">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="blog-card-meta">Coming Soon</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
