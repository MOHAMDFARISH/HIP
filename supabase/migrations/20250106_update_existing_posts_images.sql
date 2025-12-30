-- Update existing sample blog posts to use default image
-- This fixes posts that were inserted with placeholder image URLs

UPDATE blog_posts
SET featured_image = NULL
WHERE featured_image LIKE '%/v1/blog/%'
  AND featured_image NOT LIKE 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/%';

-- Alternatively, you can update specific posts by slug:
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'finding-healing-through-poetry';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'therapeutic-benefits-creative-writing';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'maldives-mindfulness-meditation';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'behind-scenes-heal-in-paradise';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'poetry-mental-health-science';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'maldivian-culture-storytelling';
-- UPDATE blog_posts SET featured_image = NULL WHERE slug = 'island-living-mental-wellness';
