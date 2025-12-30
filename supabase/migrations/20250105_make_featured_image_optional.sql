-- Make featured_image optional to support default images
ALTER TABLE blog_posts
ALTER COLUMN featured_image DROP NOT NULL;

-- Update the default value comment
COMMENT ON COLUMN blog_posts.featured_image IS
'Featured image URL. If NULL, the application will use a default image.';
