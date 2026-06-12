import Link from 'next/link';
import type { Blog } from '@/types/cms';
import { categoryLabel, formatBlogDate } from '@/lib/cms/constants';

const FALLBACK_IMAGE = '/assets/images/blog/wedding-trends.jpg';

type RelatedPostsProps = {
  posts: Blog[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="section blog-related-section">
      <div className="container">
        <span className="section-label reveal">Keep Reading</span>
        <h2 className="section-title reveal">Related Articles</h2>
        <div className="blog-grid">
          {posts.map((post) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
