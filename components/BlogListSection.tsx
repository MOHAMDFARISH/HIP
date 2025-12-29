import React, { useEffect, useState } from 'react';
import { supabase, BlogPost } from '../lib/supabaseClient';

interface BlogListSectionProps {
  navigate: (path: string) => void;
}

const BlogListSection: React.FC<BlogListSectionProps> = ({ navigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (filter === 'internal') {
        query = query.eq('is_external', false);
      } else if (filter === 'external') {
        query = query.eq('is_external', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: BlogPost) => {
    if (post.is_external && post.external_url) {
      // Open external articles in new tab
      window.open(post.external_url, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to internal blog post
      navigate(`/blog/${post.slug}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-sand-50">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl text-dark-slate mb-6">
            Blog & Articles
          </h1>
          <p className="text-xl text-dark-slate/80 max-w-2xl mx-auto">
            Explore insights on healing, poetry, and life in paradise. Featuring both original
            content and curated articles from around the web.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-body transition-all ${
              filter === 'all'
                ? 'bg-coral text-white'
                : 'bg-white text-dark-slate hover:bg-coral/10'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => setFilter('internal')}
            className={`px-6 py-3 rounded-full font-body transition-all ${
              filter === 'internal'
                ? 'bg-coral text-white'
                : 'bg-white text-dark-slate hover:bg-coral/10'
            }`}
          >
            Original Content
          </button>
          <button
            onClick={() => setFilter('external')}
            className={`px-6 py-3 rounded-full font-body transition-all ${
              filter === 'external'
                ? 'bg-coral text-white'
                : 'bg-white text-dark-slate hover:bg-coral/10'
            }`}
          >
            Featured Articles
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
            <p className="mt-4 text-dark-slate/60">Loading articles...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {post.is_external && (
                    <div className="absolute top-4 right-4 bg-ocean-blue text-white px-3 py-1 rounded-full text-sm font-body">
                      {post.external_source || 'External'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-3 text-sm text-dark-slate/60">
                    <span>{formatDate(post.published_date)}</span>
                    {post.read_time_minutes && (
                      <span>{post.read_time_minutes} min read</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-2xl text-dark-slate mb-3 group-hover:text-coral transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-dark-slate/70 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-sand-100 text-dark-slate px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center text-coral font-body font-semibold">
                    {post.is_external ? 'Read on ' + (post.external_source || 'Source') : 'Read More'}
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-slate/60 text-lg">
              No articles found. Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListSection;
