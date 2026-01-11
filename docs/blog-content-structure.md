# Blog Content Structure Guide

## Post Types

The blog system supports different post types for various content styles:

### 1. **article** (Default)
Standard blog post with text content

### 2. **list**
List-based articles like "Top 10 Souvenirs from Maldives"

### 3. **guide**
Step-by-step guides and tutorials

### 4. **gallery**
Image-heavy posts with galleries

### 5. **review**
Product or location reviews

---

## Content Blocks

Content can be structured using JSON blocks for maximum flexibility:

### Available Block Types

#### 1. Text Block
```json
{
  "type": "text",
  "content": "<p>Your HTML content here...</p>"
}
```

#### 2. Image Block
```json
{
  "type": "image",
  "url": "https://cloudinary.com/image.jpg",
  "caption": "Beautiful sunset in Maldives",
  "alt": "Sunset over Maldivian beach"
}
```

#### 3. List Block (Unordered)
```json
{
  "type": "list",
  "ordered": false,
  "items": [
    "Maldivian handicrafts",
    "Coconut products",
    "Local spices"
  ]
}
```

#### 4. List Block (Ordered)
```json
{
  "type": "list",
  "ordered": true,
  "items": [
    "Visit local markets",
    "Look for authentic crafts",
    "Bargain politely"
  ]
}
```

#### 5. Gallery Block
```json
{
  "type": "gallery",
  "images": [
    {
      "url": "https://cloudinary.com/img1.jpg",
      "caption": "Handmade lacquerware"
    },
    {
      "url": "https://cloudinary.com/img2.jpg",
      "caption": "Traditional mat weaving"
    }
  ]
}
```

#### 6. Quote Block
```json
{
  "type": "quote",
  "text": "The best souvenir is the memory of paradise",
  "author": "Hawla Riza"
}
```

#### 7. Heading Block
```json
{
  "type": "heading",
  "level": 2,
  "text": "Why These Souvenirs Matter"
}
```

#### 8. Divider Block
```json
{
  "type": "divider"
}
```

---

## Example: "Best Souvenirs from Maldives" Article

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  post_type,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published,
  content_blocks
) VALUES (
  'Top 10 Best Souvenirs from the Maldives',
  'best-souvenirs-maldives',
  'Discover the most authentic and meaningful souvenirs to bring home from your Maldivian paradise vacation.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto/v1/blog/maldives-souvenirs',
  'Hawla Riza',
  NOW(),
  'list',
  FALSE,
  ARRAY['maldives', 'travel', 'souvenirs', 'shopping', 'culture'],
  'Explore the top 10 authentic souvenirs from the Maldives, from traditional handicrafts to local delicacies.',
  ARRAY['Maldives souvenirs', 'Maldivian handicrafts', 'travel shopping', 'authentic gifts'],
  8,
  TRUE,
  '[
    {
      "type": "text",
      "content": "<p>The Maldives offers unique treasures that capture the essence of island life. Here are the best souvenirs to bring home from paradise.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Traditional Lacquerware (Laajehun)"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto/v1/blog/lacquerware",
      "caption": "Intricate Maldivian lacquerware with traditional patterns",
      "alt": "Maldivian lacquerware bowl"
    },
    {
      "type": "text",
      "content": "<p>Laajehun is a traditional Maldivian craft featuring intricate hand-carved wooden items decorated with vibrant lacquer. Each piece is unique and represents centuries of artistic tradition.</p>"
    },
    {
      "type": "list",
      "ordered": false,
      "title": "What to look for:",
      "items": [
        "Hand-carved wooden boxes",
        "Decorative bowls",
        "Jewelry containers",
        "Traditional patterns (red, yellow, black, and green)"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Woven Palm Mats (Thundu Kunaa)"
    },
    {
      "type": "text",
      "content": "<p>These beautifully woven mats are made from local palm leaves and showcase traditional Maldivian weaving techniques passed down through generations.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Coconut Products"
    },
    {
      "type": "gallery",
      "images": [
        {
          "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto/v1/blog/coconut-oil",
          "caption": "Pure virgin coconut oil"
        },
        {
          "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto/v1/blog/coconut-shell-crafts",
          "caption": "Coconut shell handicrafts"
        }
      ]
    },
    {
      "type": "list",
      "ordered": false,
      "title": "Popular coconut products:",
      "items": [
        "Virgin coconut oil",
        "Coconut shell bowls and spoons",
        "Coconut fiber products",
        "Natural coconut soaps"
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "quote",
      "text": "The best souvenirs tell a story of the place and its people",
      "author": "Local Artisan"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Where to Buy"
    },
    {
      "type": "text",
      "content": "<p>For authentic souvenirs, visit local markets in Malé, especially the local market area and souvenir shops on Chaandhanee Magu.</p>"
    }
  ]'::jsonb
);
```

---

## Option 2: Using Markdown Files

For easier content editing, you can also use markdown files:

### Structure:
```
/blog-content/
  ├── best-souvenirs-maldives.md
  ├── maldivian-cuisine-guide.md
  └── healing-through-poetry.md
```

### Example Markdown with Frontmatter:

```markdown
---
title: "Top 10 Best Souvenirs from the Maldives"
slug: "best-souvenirs-maldives"
excerpt: "Discover the most authentic and meaningful souvenirs..."
featured_image: "https://cloudinary.com/image.jpg"
author: "Hawla Riza"
published_date: "2025-01-01"
post_type: "list"
tags: ["maldives", "travel", "souvenirs"]
meta_description: "Explore the top 10 authentic souvenirs from the Maldives"
read_time_minutes: 8
is_published: true
---

# Top 10 Best Souvenirs from the Maldives

The Maldives offers unique treasures...

## 1. Traditional Lacquerware (Laajehun)

![Maldivian lacquerware](image-url)

Laajehun is a traditional craft...

**What to look for:**
- Hand-carved wooden boxes
- Decorative bowls
- Jewelry containers

## 2. Woven Palm Mats

...
```

---

## Option 3: Simple Admin Script

Create a Node.js script to easily add blog posts:

```javascript
// scripts/add-blog-post.js
import { createClient } from '@supabase/supabase-js';
import prompts from 'prompts';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addBlogPost() {
  const response = await prompts([
    {
      type: 'text',
      name: 'title',
      message: 'Post title:'
    },
    {
      type: 'text',
      name: 'slug',
      message: 'URL slug:'
    },
    {
      type: 'select',
      name: 'post_type',
      message: 'Post type:',
      choices: [
        { title: 'Article', value: 'article' },
        { title: 'List', value: 'list' },
        { title: 'Guide', value: 'guide' },
        { title: 'Gallery', value: 'gallery' }
      ]
    }
    // ... more prompts
  ]);

  // Insert into database
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([response]);

  console.log('Post created!', data);
}

addBlogPost();
```

---

## Recommended Workflow

### For Maximum Flexibility:

1. **Use content_blocks (JSON)** for structured content
2. **Add a simple admin panel** or use SQL directly
3. **Create templates** for different post types
4. **Update BlogPostSection.tsx** to render different block types

### For Ease of Use:

1. **Use markdown files** with frontmatter
2. **Build script** to convert markdown to database entries
3. **Version control** your content with Git
4. **Preview locally** before publishing

---

## Next Steps

Choose one approach and I can help you:
1. Build the content block renderer
2. Create an admin interface
3. Set up markdown-to-database conversion
4. Create templates for different post types
