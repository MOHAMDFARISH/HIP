import React, { useEffect, useState } from 'react';
import { supabase, BlogPost } from '../lib/supabaseClient';
import ShareButtons from './ShareButtons';
import ContentBlockRenderer from './ContentBlockRenderer';

interface BlogPostSectionProps {
  slug: string;
  navigate: (path: string) => void;
}

const BlogPostSection: React.FC<BlogPostSectionProps> = ({ slug, navigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // Default featured image
  const DEFAULT_IMAGE = 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg';

  useEffect(() => {
    fetchPost();
    incrementViews();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else if (data) {
        setPost(data);

        // Update document metadata for SEO
        if (typeof document !== 'undefined') {
          document.title = `${data.title} | Heal in Paradise Blog`;

          // Update meta description
          let metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.meta_description);
          }

          // Update Open Graph tags
          let ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.setAttribute('content', data.title);
          }

          let ogDescription = document.querySelector('meta[property="og:description"]');
          if (ogDescription) {
            ogDescription.setAttribute('content', data.meta_description);
          }

          let ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            ogImage.setAttribute('content', data.featured_image);
          }
        }

        // Fetch related posts
        fetchRelatedPosts(data.tags);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (tags: string[]) => {
    if (!tags || tags.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .neq('slug', slug)
        .overlaps('tags', tags)
        .limit(3);

      if (!error && data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment_post_views', { post_slug: slug });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRelatedPostClick = (relatedPost: BlogPost) => {
    if (relatedPost.is_external && relatedPost.external_url) {
      window.open(relatedPost.external_url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/blog/${relatedPost.slug}`);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
          <p className="mt-4 text-dark-slate/60">Loading article...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="font-heading text-4xl text-dark-slate mb-4">Article Not Found</h1>
          <p className="text-dark-slate/70 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-coral text-white px-8 py-3 rounded-full hover:bg-coral/90 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </section>
    );
  }

  // Add JSON-LD structured data for the article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description,
    "image": post.featured_image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Heal in Paradise",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hawlariza.com/logo.png"
      }
    },
    "datePublished": post.published_date,
    "dateModified": post.updated_date || post.published_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hawlariza.com/blog/${post.slug}`
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <article className="py-12 bg-white">
        {/* Hero Section with Featured Image */}
        <div className="relative h-96 mb-12">
          <img
            src={post.featured_image || DEFAULT_IMAGE}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-12">
            <div className="max-w-4xl mx-auto">
              {post.is_external && (
                <span className="inline-block bg-ocean-blue text-white px-4 py-2 rounded-full text-sm font-body mb-4">
                  Featured from {post.external_source}
                </span>
              )}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-white/90">
                <span className="font-body">By {post.author}</span>
                <span>•</span>
                <span>{formatDate(post.published_date)}</span>
                {post.read_time_minutes && (
                  <>
                    <span>•</span>
                    <span>{post.read_time_minutes} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 max-w-4xl">
          {/* External Link Notice */}
          {post.is_external && post.external_url && (
            <div className="bg-ocean-blue/10 border-l-4 border-ocean-blue p-6 mb-8 rounded">
              <p className="text-dark-slate mb-4">
                This article was originally published on {post.external_source}.
              </p>
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-ocean-blue hover:text-ocean-blue/80 font-semibold"
              >
                Read the full article on {post.external_source}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* Article Content */}
          <div className="mb-12">
            <p className="text-xl text-dark-slate/80 font-body leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Render structured content blocks if available */}
            {post.content_blocks && post.content_blocks.length > 0 ? (
              <ContentBlockRenderer blocks={post.content_blocks} />
            ) : post.content ? (
              /* Fallback to legacy HTML content */
              <div
                className="prose prose-lg max-w-none text-dark-slate/90 font-body leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : null}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="font-heading text-xl text-dark-slate mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm font-medium bg-coral/10 text-coral border border-coral/20 px-4 py-2 rounded-full hover:bg-coral/20 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="border-t border-b border-sand-200 py-8 mb-12">
            <h3 className="font-heading text-xl text-dark-slate mb-4">Share this article</h3>
            <ShareButtons
              url={`https://hawlariza.com/blog/${post.slug}`}
              title={post.title}
            />
          </div>

          {/* Back to Blog */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/blog')}
              className="text-coral hover:text-coral/80 font-body font-semibold flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-sand-200 pt-12">
              <h3 className="font-heading text-3xl text-dark-slate mb-8">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    onClick={() => handleRelatedPostClick(relatedPost)}
                    className="bg-sand-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={relatedPost.featured_image || DEFAULT_IMAGE}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-heading text-lg text-dark-slate mb-2 group-hover:text-coral transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-dark-slate/60">
                        {formatDate(relatedPost.published_date)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostSection;
