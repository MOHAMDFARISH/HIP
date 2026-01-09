-- Create media table for press coverage, interviews, and video content

CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'video', 'interview', 'article', 'podcast'
  source_type TEXT NOT NULL, -- 'youtube', 'youtube-short', 'tv', 'website', 'social'
  embed_url TEXT, -- YouTube embed URL, video URL, etc.
  external_url TEXT, -- Link to original source
  thumbnail_url TEXT, -- Thumbnail image
  source_name TEXT, -- e.g., "PSM TV", "TVM", "YouTube"
  published_date TIMESTAMPTZ,
  duration_minutes INTEGER, -- For videos/interviews
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_items_is_published ON media_items(is_published);
CREATE INDEX IF NOT EXISTS idx_media_items_is_featured ON media_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_display_order ON media_items(display_order);
CREATE INDEX IF NOT EXISTS idx_media_items_published_date ON media_items(published_date DESC);

-- Enable Row Level Security
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published media
CREATE POLICY "Allow public read access to published media"
  ON media_items FOR SELECT
  USING (is_published = true);

-- Create policy to allow authenticated users to manage media
CREATE POLICY "Allow authenticated users to manage media"
  ON media_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Add comments
COMMENT ON TABLE media_items IS 'Press coverage, TV interviews, and video content about "Heal in Paradise"';
COMMENT ON COLUMN media_items.media_type IS 'Type: video, interview, article, podcast';
COMMENT ON COLUMN media_items.source_type IS 'Platform: youtube, youtube-short, tv, website, social';
COMMENT ON COLUMN media_items.embed_url IS 'Embeddable URL (e.g., YouTube embed link)';
COMMENT ON COLUMN media_items.external_url IS 'Link to original source';
COMMENT ON COLUMN media_items.is_featured IS 'Highlight important media coverage';
