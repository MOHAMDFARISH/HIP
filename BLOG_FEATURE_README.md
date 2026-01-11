# Blog Feature Documentation

## Overview

This website now includes a comprehensive blog section that supports both internal blog posts and external article links (from news websites and other sources). The blog is fully integrated with SEO optimization, including sitemap generation, structured data, and meta tags.

## Features

### 1. **Dual Content Types**
- **Internal Posts**: Full blog posts hosted on the site with complete content
- **External Links**: Curated articles from news websites and other sources that open in new tabs

### 2. **SEO Optimization**
- Dynamic sitemap.xml generation including all published blog posts
- Article structured data (JSON-LD schema) for search engines
- Meta tags (title, description, keywords) for each post
- Open Graph and Twitter Card support
- Automatic view count tracking

### 3. **User Features**
- Filter posts by type (All, Original Content, Featured Articles)
- Tag-based filtering and related posts
- Social media sharing buttons
- Responsive design for mobile and desktop
- Reading time estimates

## Database Schema

The blog uses a Supabase table called `blog_posts` with the following structure:

```sql
- id: UUID (primary key)
- title: TEXT (post title)
- slug: TEXT (URL-friendly identifier, unique)
- excerpt: TEXT (short summary)
- content: TEXT (full HTML content, optional for external links)
- featured_image: TEXT (image URL)
- author: TEXT (author name, defaults to 'Hawla Riza')
- published_date: TIMESTAMPTZ (publication date)
- updated_date: TIMESTAMPTZ (last update date)
- is_external: BOOLEAN (true for external links)
- external_url: TEXT (URL to external article)
- external_source: TEXT (e.g., "BBC News", "The Guardian")
- tags: TEXT[] (array of tags)
- meta_description: TEXT (SEO description)
- meta_keywords: TEXT[] (SEO keywords)
- read_time_minutes: INTEGER (estimated reading time)
- is_published: BOOLEAN (publication status)
- views_count: INTEGER (view counter)
- created_at: TIMESTAMPTZ (creation timestamp)
```

## Setup Instructions

### 1. Run Database Migrations

Execute the SQL migrations in your Supabase database:

```bash
# Run the schema migration
psql -f supabase/migrations/20250101_create_blog_posts.sql

# Run the sample data migration (optional)
psql -f supabase/migrations/20250102_insert_sample_blog_posts.sql
```

Or use the Supabase dashboard to run these SQL commands.

### 2. Environment Variables

Ensure these environment variables are set:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3. Deploy

Deploy to Vercel or your hosting platform. The blog routes will be automatically configured.

## Adding Blog Posts

### Method 1: Direct SQL Insert (Internal Post)

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  published_date,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Your Blog Post Title',
  'your-blog-post-slug',
  'A brief excerpt or summary of your post...',
  '<p>Your full HTML content here...</p>',
  'https://your-image-url.com/image.jpg',
  'Hawla Riza',
  NOW(),
  FALSE,
  ARRAY['tag1', 'tag2', 'tag3'],
  'SEO-friendly meta description',
  ARRAY['keyword1', 'keyword2'],
  5,
  TRUE
);
```

### Method 2: Adding External Article Link

```sql
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
  'Interesting Article from BBC',
  'interesting-article-bbc',
  'This article discusses...',
  'https://your-image-url.com/image.jpg',
  'BBC News Team',
  NOW(),
  TRUE,
  'https://www.bbc.com/news/article-url',
  'BBC News',
  ARRAY['news', 'wellness'],
  'Description of the external article',
  ARRAY['news', 'wellness', 'health'],
  10,
  TRUE
);
```

## Routes

- `/blog` - Main blog listing page
- `/blog/[slug]` - Individual blog post page

## API Endpoints

### GET /api/get-blog-posts

Fetch all published blog posts with optional filtering.

**Query Parameters:**
- `filter`: 'all' | 'internal' | 'external'
- `tag`: Filter by specific tag
- `limit`: Number of posts to return
- `offset`: Pagination offset

**Example:**
```
GET /api/get-blog-posts?filter=internal&limit=10
```

### GET /api/get-blog-post

Fetch a single blog post by slug.

**Query Parameters:**
- `slug`: The post slug (required)

**Example:**
```
GET /api/get-blog-post?slug=finding-healing-through-poetry
```

## Content Management

### Recommended Workflow

1. **Create Draft**: Insert post with `is_published = FALSE`
2. **Review**: Check content, SEO metadata, and images
3. **Publish**: Update `is_published = TRUE`
4. **Monitor**: Check view counts and engagement

### Best Practices

1. **Images**: Use Cloudinary or similar CDN for featured images
2. **Slugs**: Keep slugs URL-friendly (lowercase, hyphens, no special characters)
3. **SEO**: Write unique meta descriptions (150-160 characters)
4. **Tags**: Use 3-7 relevant tags per post
5. **External Sources**: Always credit the original source properly

## SEO Features

### Automatic Sitemap Updates

The sitemap at `/sitemap.xml` automatically includes:
- All published internal blog posts
- Proper lastmod dates
- Appropriate priority levels (0.7 for blog posts)

### Structured Data

Each blog post page includes Article schema with:
- Headline
- Description
- Author information
- Publisher details
- Publication and modification dates
- Featured image

### Meta Tags

Each post automatically generates:
- Page title
- Meta description
- Keywords
- Open Graph tags (for social sharing)
- Twitter Card tags

## Customization

### Styling

The blog uses the existing Tailwind CSS theme with:
- Coral (#FF6B6B) for accents
- Ocean Blue (#0077BE) for links
- Sand (#F5F0E8) for backgrounds
- Dark Slate (#2C3E50) for text

### Fonts

- Headings: Cormorant Garamond
- Body: Lato

## Troubleshooting

### Posts Not Showing

1. Check `is_published = TRUE`
2. Verify Supabase connection
3. Check browser console for errors
4. Verify environment variables

### External Links Not Opening

1. Ensure `is_external = TRUE`
2. Verify `external_url` is set correctly
3. Check for HTTPS URLs

### SEO Issues

1. Run sitemap generation: Visit `/sitemap.xml`
2. Validate structured data: Use Google's Rich Results Test
3. Check meta tags in browser inspector

## Future Enhancements

Potential features to add:

- [ ] Admin dashboard for managing posts
- [ ] Comments section
- [ ] Newsletter integration
- [ ] Search functionality
- [ ] Category taxonomy
- [ ] Author profiles
- [ ] RSS feed
- [ ] Analytics dashboard

## Support

For questions or issues, please refer to:
- Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev
- Vite documentation: https://vitejs.dev
