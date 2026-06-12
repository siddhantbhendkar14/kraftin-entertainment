import type { Blog } from '@/types/cms';
import { categoryLabel, formatBlogDate } from '@/lib/cms/constants';
import { sanitizeBlogHtml } from '@/lib/sanitize-html';
import RelatedPosts from './RelatedPosts';

type BlogArticleViewProps = {
  blog: Blog;
  related: Blog[];
  preview?: boolean;
};

export default function BlogArticleView({ blog, related, preview }: BlogArticleViewProps) {
  const heroImage = blog.featured_image || '/assets/images/blog/blog-hero.jpg';

  return (
    <>
      {preview ? (
        <div className="blog-preview-banner" role="status">
          Preview mode — this {blog.status === 'draft' ? 'draft' : 'article'} is not public unless published.
        </div>
      ) : null}

      <section className="page-hero page-hero--media">
        <div className="page-hero-bg" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="page-hero-overlay" />
        <div className="container">
          <span className="section-label reveal">{categoryLabel(blog.category) || 'Blog'}</span>
          <h1>{blog.title}</h1>
          {blog.published_at ? (
            <p className="section-subtitle mx-auto reveal" style={{ marginTop: 16 }}>
              {formatBlogDate(blog.published_at)}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container blog-article-container">
          {blog.excerpt ? <p className="blog-article-excerpt reveal">{blog.excerpt}</p> : null}
          <article
            className="blog-article-body reveal"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.content) }}
          />
          {blog.tags?.length ? (
            <div className="blog-article-tags reveal">
              {blog.tags.map((tag) => (
                <span key={tag} className="blog-category">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <RelatedPosts posts={related} />
    </>
  );
}
