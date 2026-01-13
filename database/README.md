# Page Metadata Management

This directory contains the database schema and documentation for managing Open Graph metadata for main pages.

## Overview

The `page_metadata` table allows you to update Open Graph images and SEO metadata for main pages (home, book, author, blog listing) from your backend without redeploying the frontend.

Blog posts automatically derive their metadata from the `blog_posts` table (title, meta_description, featured_image).

## Database Schema

### Table: `page_metadata`

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `page_slug` | VARCHAR(100) | Unique page identifier (e.g., 'home', 'book', 'author', 'blog') |
| `page_title` | TEXT | HTML `<title>` tag content |
| `og_title` | TEXT | Open Graph title |
| `og_description` | TEXT | Open Graph description |
| `og_image` | TEXT | Open Graph image URL |
| `og_type` | VARCHAR(50) | Open Graph type (website, book, profile, etc.) |
| `canonical_url` | TEXT | Canonical URL for the page |
| `is_active` | BOOLEAN | Enable/disable page metadata |
| `updated_at` | TIMESTAMP | Auto-updated on changes |
| `created_at` | TIMESTAMP | Record creation time |

## Setup Instructions

### 1. Run the Migration

Execute the SQL migration in your Supabase SQL editor:

```bash
# Option A: Copy the contents of page_metadata.sql and run in Supabase SQL editor
# Option B: Run via command line (if you have psql access)
psql -h <your-host> -U <your-user> -d <your-database> -f database/page_metadata.sql
```

### 2. Verify Installation

Check that the table was created:

```sql
SELECT * FROM page_metadata;
```

You should see 4 rows (home, book, author, blog) with default metadata.

## Usage

### Updating Page Metadata

Update metadata through your backend admin panel or directly in Supabase:

```sql
-- Update homepage OG image
UPDATE page_metadata
SET og_image = 'https://your-cdn.com/new-home-image.jpg',
    og_title = 'Updated Homepage Title',
    og_description = 'Updated homepage description'
WHERE page_slug = 'home';

-- Update book page
UPDATE page_metadata
SET og_image = 'https://your-cdn.com/book-cover-new.jpg'
WHERE page_slug = 'book';

-- Update author page
UPDATE page_metadata
SET og_image = 'https://your-cdn.com/author-photo.jpg',
    og_type = 'profile'
WHERE page_slug = 'author';

-- Update blog listing page
UPDATE page_metadata
SET og_image = 'https://your-cdn.com/blog-banner.jpg'
WHERE page_slug = 'blog';
```

### Temporarily Disable a Page

```sql
UPDATE page_metadata
SET is_active = false
WHERE page_slug = 'book';
```

When disabled, the page handler will fall back to hardcoded default values.

### View Current Metadata

```sql
SELECT page_slug, og_title, og_image, is_active, updated_at
FROM page_metadata
ORDER BY page_slug;
```

## How It Works

### 1. Social Media Crawler Detection

When a social media crawler (Facebook, Twitter, LinkedIn, WhatsApp, etc.) visits your site:

1. The request hits a Vercel serverless function (`/api/pages/[page].ts`)
2. The function detects the crawler via User-Agent header
3. It fetches metadata from the `page_metadata` table
4. It injects the metadata into the HTML before sending the response
5. The crawler sees the correct Open Graph tags

### 2. Regular Browser Visitors

Regular visitors bypass the database lookup and get served the static HTML directly, allowing your React SPA to handle routing normally.

### 3. Caching

- Responses are cached for 1 hour (`Cache-Control: max-age=3600`)
- This reduces database queries and improves performance
- After updating metadata, social media platforms may need to re-scrape:
  - Facebook: https://developers.facebook.com/tools/debug/
  - Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector/

## Debug Headers

Each page handler includes debug headers to help troubleshoot:

- `X-Page-Handler`: Which handler processed the request
- `X-Is-Crawler`: Whether the request was from a crawler
- `X-Metadata-Source`: Whether metadata came from 'database' or 'default' fallback
- `X-DB-Error`: Any database errors (if metadata fetch failed)

View headers in browser dev tools (Network tab) or use curl:

```bash
curl -I https://hawlariza.com/book -H "User-Agent: facebookexternalhit/1.1"
```

## API Endpoints

### Page Handlers

- `/` → `/api/pages/home`
- `/book` → `/api/pages/book`
- `/author` → `/api/pages/author`
- `/blog` → `/api/pages/blog-listing`
- `/blog/:slug` → `/api/blog/:slug` (uses blog_posts table)

### Checking Metadata

Visit `/api/debug-blog-slugs` to see all blog posts and their metadata.

## Fallback Behavior

If the database is unavailable or a page_slug doesn't exist:

1. The handler uses hardcoded `DEFAULT_METADATA` values
2. The response includes `X-Metadata-Source: default` header
3. The site continues to work normally

## Example: Adding a New Page

To add OG metadata for a new page (e.g., `/contact`):

### 1. Insert Database Row

```sql
INSERT INTO page_metadata (
  page_slug,
  page_title,
  og_title,
  og_description,
  og_image,
  og_type,
  canonical_url
) VALUES (
  'contact',
  'Contact Us | Heal in Paradise',
  'Contact Us | Heal in Paradise',
  'Get in touch with Hawla Riza. Send inquiries about book orders, speaking engagements, or literary collaborations.',
  'https://your-cdn.com/contact-og-image.jpg',
  'website',
  'https://hawlariza.com/contact'
);
```

### 2. Create Handler File

Create `/api/pages/contact.ts` (copy from `book.ts` and change `page_slug` to `'contact'`).

### 3. Update Routing

Add to `vercel.json`:

```json
{
  "source": "/contact",
  "destination": "/api/pages/contact"
}
```

### 4. Deploy

Push changes and Vercel will auto-deploy.

## Best Practices

1. **Image Requirements:**
   - OG images should be at least 1200x630 pixels
   - Use JPG or PNG format
   - Keep file size under 1MB for faster loading
   - Host on a CDN (Cloudinary, imgix, etc.)

2. **Title Length:**
   - Keep titles under 60 characters
   - Most important words first

3. **Description Length:**
   - Keep descriptions between 150-160 characters
   - Be descriptive but concise

4. **Testing:**
   - Always test with social media debuggers after updates
   - Clear cache if needed (click "Scrape Again" multiple times)

5. **Monitoring:**
   - Check debug headers if metadata isn't updating
   - Verify `X-Metadata-Source: database` to confirm DB connection

## Troubleshooting

### Social Media Shows Old Image

**Solution:** Use the platform's debugger tool and click "Scrape Again" multiple times. Social platforms cache metadata aggressively.

### Handler Returns Default Metadata

**Possible causes:**
1. `page_slug` doesn't match (check for typos)
2. `is_active = false` in database
3. Database connection issue (check `X-DB-Error` header)
4. Supabase environment variables not set in Vercel

**Check:**
```sql
SELECT * FROM page_metadata WHERE page_slug = 'your-slug';
```

### Images Not Displaying

**Possible causes:**
1. Image URL is incorrect or broken
2. Image is too large (>1MB)
3. CORS issues (CDN must allow social media crawlers)

**Test:**
```bash
curl -I <your-og-image-url>
# Should return 200 OK
```

## Security Notes

- The anon key is safe to expose (it's in client-side code anyway)
- Use Row Level Security (RLS) policies if you want to restrict access
- Never expose the service key in client-side code

## Support

For issues or questions:
1. Check debug headers in the response
2. Verify database row exists and is active
3. Test with social media debuggers
4. Check Vercel function logs for errors
