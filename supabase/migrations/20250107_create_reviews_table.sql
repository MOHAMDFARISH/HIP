-- Create reviews table for reader testimonials

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  reviewer_title TEXT, -- e.g., "Poetry Enthusiast", "Book Club Member"
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Optional 1-5 star rating
  reviewer_photo TEXT, -- Optional photo URL
  reviewer_location TEXT, -- e.g., "Malé, Maldives"
  is_featured BOOLEAN DEFAULT FALSE, -- Highlight special reviews
  is_published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0, -- For custom ordering
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_display_order ON reviews(display_order);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published reviews
CREATE POLICY "Allow public read access to published reviews"
  ON reviews FOR SELECT
  USING (is_published = true);

-- Create policy to allow authenticated users to manage reviews
CREATE POLICY "Allow authenticated users to manage reviews"
  ON reviews FOR ALL
  USING (auth.role() = 'authenticated');

-- Add comments
COMMENT ON TABLE reviews IS 'Reader reviews and testimonials for "Heal in Paradise"';
COMMENT ON COLUMN reviews.reviewer_photo IS 'Optional photo URL. If NULL, will show initials avatar';
COMMENT ON COLUMN reviews.rating IS 'Optional 1-5 star rating';
COMMENT ON COLUMN reviews.is_featured IS 'Set to true for special/prominent reviews';
COMMENT ON COLUMN reviews.display_order IS 'Lower numbers appear first. Use for custom ordering';
