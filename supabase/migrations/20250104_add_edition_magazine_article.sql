-- Featured article from Edition Magazine
-- Update the title, excerpt, and tags based on the actual article content
-- URL: https://edition.mv/features/44584?ref=home-editors-pick

-- OPTION 1: Use default image (recommended)
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  is_external,
  external_url,
  external_source,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Featured Article from Edition Magazine',  -- UPDATE: Replace with actual article title
  'edition-magazine-featured-article',        -- UPDATE: Replace with SEO-friendly slug
  'An insightful article from Edition Magazine exploring topics relevant to Maldivian culture and society.',  -- UPDATE: Replace with actual article excerpt
  'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg',  -- Using default Maldivian beach image
  'Edition Magazine',
  NOW(),
  TRUE,
  'https://edition.mv/features/44584?ref=home-editors-pick',
  'Edition Magazine',
  ARRAY['maldives', 'culture', 'featured'],  -- UPDATE: Replace with relevant tags from the article
  'Featured article from Edition Magazine',  -- UPDATE: Add proper meta description
  ARRAY['Maldives', 'Edition Magazine', 'featured article'],  -- UPDATE: Add relevant keywords
  8,  -- UPDATE: Estimate reading time
  TRUE
);

-- OPTION 2: Use NULL to trigger default image (requires running migration 20250105 first)
-- featured_image can be set to NULL after running the migration to make it optional

-- INSTRUCTIONS FOR UPDATING:
-- 1. Visit the article: https://edition.mv/features/44584?ref=home-editors-pick
-- 2. Replace the title with the actual article title
-- 3. Update the slug to be URL-friendly (lowercase, hyphens, no special chars)
-- 4. Copy a compelling excerpt from the article (150-200 characters)
-- 5. Add relevant tags based on the article content
-- 6. Update meta_description and meta_keywords for SEO
-- 7. Estimate the reading time in minutes
-- 8. Optionally: Add a custom featured_image URL or keep the default
-- 9. Run this SQL in Supabase SQL Editor
