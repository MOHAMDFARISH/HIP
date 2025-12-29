-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT, -- Optional for external links
  featured_image TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Hawla Riza',
  published_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMPTZ,
  is_external BOOLEAN DEFAULT FALSE,
  external_url TEXT, -- URL to external news article
  external_source TEXT, -- e.g., "BBC News", "The Guardian"
  tags TEXT[] DEFAULT '{}',
  meta_description TEXT NOT NULL,
  meta_keywords TEXT[] DEFAULT '{}',
  read_time_minutes INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on published_date for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);

-- Create index on is_published for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);

-- Create index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Create policy to allow authenticated users to insert/update (admin only)
-- This can be customized based on your auth setup
CREATE POLICY "Allow authenticated users to manage posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');
