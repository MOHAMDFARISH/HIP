-- Page Metadata Table
-- Stores Open Graph and SEO metadata for main pages
-- This allows updating page metadata from the backend without redeploying

CREATE TABLE IF NOT EXISTS page_metadata (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'home', 'book', 'author', 'blog'
  page_title TEXT NOT NULL, -- HTML <title> tag
  og_title TEXT NOT NULL, -- Open Graph title
  og_description TEXT NOT NULL, -- Open Graph description
  og_image TEXT NOT NULL, -- Open Graph image URL
  og_type VARCHAR(50) NOT NULL DEFAULT 'website', -- og:type (website, book, profile, etc.)
  canonical_url TEXT NOT NULL, -- Canonical URL
  is_active BOOLEAN DEFAULT TRUE, -- Enable/disable page
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on page_slug for fast lookups
CREATE INDEX idx_page_metadata_slug ON page_metadata(page_slug);

-- Add comment to table
COMMENT ON TABLE page_metadata IS 'Stores Open Graph and SEO metadata for main pages (home, book, author, blog listing)';

-- Insert default data for main pages
INSERT INTO page_metadata (page_slug, page_title, og_title, og_description, og_image, og_type, canonical_url) VALUES
(
  'home',
  'Heal in Paradise: The First Maldivian Literary Souvenir',
  'Heal in Paradise: The First Maldivian Literary Souvenir',
  'Order the first-ever Maldivian literary souvenir. A powerful collection of Maldivian poetry by Hawla Riza about hope, healing, and island life.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'book',
  'https://hawlariza.com'
),
(
  'book',
  'Heal in Paradise: Order Your Copy | Maldivian Literary Souvenir',
  'Heal in Paradise: Order Your Copy | Maldivian Literary Souvenir',
  'Order your copy of Heal in Paradise, the first-ever Maldivian literary souvenir. A powerful collection of poetry by Hawla Riza about hope, healing, and island life. Available now.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'book',
  'https://hawlariza.com/book'
),
(
  'author',
  'About Hawla Riza | Maldivian Poet & Author',
  'About Hawla Riza | Maldivian Poet & Author',
  'Meet Hawla Riza, the Maldivian poet behind Heal in Paradise. Discover her journey, inspirations, and the story behind the first Maldivian literary souvenir.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'profile',
  'https://hawlariza.com/author'
),
(
  'blog',
  'Blog | Heal in Paradise - Poetry, Culture & Island Life',
  'Blog | Heal in Paradise - Poetry, Culture & Island Life',
  'Read the latest articles, poetry insights, and stories from Hawla Riza. Explore Maldivian culture, literature, and the journey behind Heal in Paradise.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg',
  'website',
  'https://hawlariza.com/blog'
),
(
  'reviews',
  'Reviews | Heal in Paradise - Reader Testimonials',
  'Reviews | Heal in Paradise - Reader Testimonials',
  'Read what readers are saying about Heal in Paradise. Discover testimonials and reviews from those who have experienced this Maldivian literary souvenir.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'website',
  'https://hawlariza.com/reviews'
),
(
  'media',
  'Media | Heal in Paradise - Press & Coverage',
  'Media | Heal in Paradise - Press & Coverage',
  'Explore media coverage, press releases, and features about Heal in Paradise and Hawla Riza. View interviews, articles, and media appearances.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'website',
  'https://hawlariza.com/media'
),
(
  'faq',
  'FAQ | Heal in Paradise - Frequently Asked Questions',
  'FAQ | Heal in Paradise - Frequently Asked Questions',
  'Find answers to frequently asked questions about Heal in Paradise, ordering, shipping, and more. Get all the information you need about this Maldivian literary souvenir.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'website',
  'https://hawlariza.com/faq'
),
(
  'contact',
  'Contact | Heal in Paradise - Get in Touch',
  'Contact | Heal in Paradise - Get in Touch',
  'Contact Hawla Riza about Heal in Paradise. Reach out for book inquiries, speaking engagements, media requests, or general questions.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  'website',
  'https://hawlariza.com/contact'
)
ON CONFLICT (page_slug) DO NOTHING;

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on UPDATE
CREATE TRIGGER trigger_update_page_metadata_updated_at
  BEFORE UPDATE ON page_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_page_metadata_updated_at();
