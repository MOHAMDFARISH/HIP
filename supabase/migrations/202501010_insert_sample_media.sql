-- Insert sample media items for "Heal in Paradise"

-- YouTube Video Example 1
INSERT INTO media_items (
  title,
  description,
  media_type,
  source_type,
  embed_url,
  external_url,
  thumbnail_url,
  source_name,
  published_date,
  duration_minutes,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Author Interview: The Story Behind Heal in Paradise',
  'Hawla Riza discusses the inspiration behind her poetry collection and the journey of healing through creativity.',
  'interview',
  'youtube',
  'https://www.youtube.com/watch?v=EXAMPLE_VIDEO_ID',  -- UPDATE: Replace with actual YouTube URL
  'https://www.youtube.com/watch?v=EXAMPLE_VIDEO_ID',
  NULL,  -- YouTube auto-generates thumbnail
  'YouTube',
  NOW() - INTERVAL '7 days',
  15,
  TRUE,  -- Featured
  TRUE,
  1
);

-- TV Interview Example
INSERT INTO media_items (
  title,
  description,
  media_type,
  source_type,
  embed_url,
  external_url,
  thumbnail_url,
  source_name,
  published_date,
  duration_minutes,
  is_featured,
  is_published,
  display_order
) VALUES (
  'PSM TV Morning Show: Poetry and Healing',
  'Live interview on PSM TV discussing poetry as a tool for mental health and emotional well-being.',
  'interview',
  'tv',
  NULL,  -- TV content might not have embed URL
  'https://example.com/psm-tv-interview',  -- UPDATE: Add actual link
  'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg',  -- Placeholder thumbnail
  'PSM TV',
  NOW() - INTERVAL '14 days',
  20,
  FALSE,
  TRUE,
  2
);

-- YouTube Short Example
INSERT INTO media_items (
  title,
  description,
  media_type,
  source_type,
  embed_url,
  external_url,
  thumbnail_url,
  source_name,
  published_date,
  duration_minutes,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Poetry Reading: Excerpt from Heal in Paradise',
  'A short reading from the poetry collection, perfect for a quick dose of inspiration.',
  'video',
  'youtube-short',
  'https://www.youtube.com/shorts/EXAMPLE_SHORT_ID',  -- UPDATE: Replace with actual YouTube Shorts URL
  'https://www.youtube.com/shorts/EXAMPLE_SHORT_ID',
  NULL,
  'YouTube Shorts',
  NOW() - INTERVAL '3 days',
  1,
  FALSE,
  TRUE,
  3
);

-- Article/Press Coverage Example
INSERT INTO media_items (
  title,
  description,
  media_type,
  source_type,
  embed_url,
  external_url,
  thumbnail_url,
  source_name,
  published_date,
  duration_minutes,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Local Poet Publishes Debut Collection',
  'Feature article about Hawla Riza and her new poetry collection Heal in Paradise.',
  'article',
  'website',
  NULL,
  'https://edition.mv/features/12345',  -- UPDATE: Add actual article link
  'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg',
  'Edition Magazine',
  NOW() - INTERVAL '21 days',
  NULL,  -- No duration for articles
  FALSE,
  TRUE,
  4
);

-- INSTRUCTIONS FOR UPDATING:
-- 1. Replace EXAMPLE_VIDEO_ID with actual YouTube video IDs
-- 2. Replace EXAMPLE_SHORT_ID with actual YouTube Shorts IDs
-- 3. Update external URLs with real links
-- 4. Add custom thumbnail URLs if available
-- 5. Update source names (TV channels, websites, etc.)
-- 6. Adjust published dates as needed
-- 7. Set is_featured = TRUE for most important media items

-- YOUTUBE URL FORMATS:
-- Regular video: https://www.youtube.com/watch?v=VIDEO_ID
-- YouTube Short: https://www.youtube.com/shorts/SHORT_ID
-- The embed_url can be the same as external_url, the component will extract the ID
