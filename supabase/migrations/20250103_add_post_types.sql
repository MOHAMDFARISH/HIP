-- Add post_type and content_blocks to blog_posts table

-- Add post_type column for different article layouts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'article';

-- Add content_blocks column for structured content (JSON)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS content_blocks JSONB;

-- Add index on post_type for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_post_type ON blog_posts(post_type);

-- Comment describing the structure
COMMENT ON COLUMN blog_posts.post_type IS
'Type of post: article (default), list, guide, review, gallery, etc.';

COMMENT ON COLUMN blog_posts.content_blocks IS
'Structured content as JSON array:
[
  {"type": "text", "content": "paragraph text"},
  {"type": "image", "url": "...", "caption": "..."},
  {"type": "list", "items": [...], "ordered": false},
  {"type": "gallery", "images": [...]},
  {"type": "quote", "text": "...", "author": "..."}
]';
