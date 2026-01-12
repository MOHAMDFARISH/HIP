import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  'https://qgcgzoysvxpnjegijmmu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY'
);

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg';

async function generateBlogPages() {
  console.log('Fetching published blog posts from Supabase...');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('No published blog posts found.');
    return;
  }

  console.log(`Found ${posts.length} published blog posts.`);

  // Read the base index.html template
  const templatePath = path.join(process.cwd(), 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Create public/blog directory - Vite will copy to dist
  const publicDir = path.join(process.cwd(), 'public');
  const blogDir = path.join(publicDir, 'blog');

  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory');
  }

  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
    console.log('Created public/blog directory');
  }

  // Generate HTML for each post
  for (const post of posts) {
    const postUrl = `https://hawlariza.com/blog/${post.slug}`;
    const shareImage = post.featured_image || DEFAULT_IMAGE;

    console.log(`Generating page for: ${post.slug}`);

    // Escape HTML entities
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeTitle = escapeHtml(post.title);
    const safeDescription = escapeHtml(post.meta_description);

    // Replace meta tags in the template
    let html = template
      // Update title
      .replace(
        /<title>.*?<\/title>/,
        `<title>${safeTitle} | Heal in Paradise Blog</title>`
      )
      // Update description
      .replace(
        /<meta name="description" content="[^"]*".*?>/,
        `<meta name="description" content="${safeDescription}" />`
      )
      // Update canonical URL
      .replace(
        /<link rel="canonical" href="[^"]*".*?>/,
        `<link rel="canonical" href="${postUrl}" />`
      )
      // Update Open Graph type
      .replace(
        /<meta property="og:type" content="[^"]*".*?>/,
        `<meta property="og:type" content="article" />`
      )
      // Update Open Graph URL
      .replace(
        /<meta property="og:url" content="[^"]*".*?>/,
        `<meta property="og:url" content="${postUrl}" />`
      )
      // Update Open Graph title
      .replace(
        /<meta property="og:title" content="[^"]*".*?>/,
        `<meta property="og:title" content="${safeTitle}" />`
      )
      // Update Open Graph description
      .replace(
        /<meta property="og:description" content="[^"]*".*?>/,
        `<meta property="og:description" content="${safeDescription}" />`
      )
      // Update Open Graph image
      .replace(
        /<meta property="og:image" content="[^"]*".*?>/,
        `<meta property="og:image" content="${shareImage}" />`
      )
      // Update Twitter URL
      .replace(
        /<meta property="twitter:url" content="[^"]*".*?>/,
        `<meta property="twitter:url" content="${postUrl}" />`
      )
      // Update Twitter title
      .replace(
        /<meta name="twitter:title" content="[^"]*".*?>/,
        `<meta name="twitter:title" content="${safeTitle}" />`
      )
      // Update Twitter description
      .replace(
        /<meta name="twitter:description" content="[^"]*".*?>/,
        `<meta name="twitter:description" content="${safeDescription}" />`
      )
      // Update Twitter image
      .replace(
        /<meta name="twitter:image" content="[^"]*".*?>/,
        `<meta name="twitter:image" content="${shareImage}" />`
      );

    // Write the HTML file
    const outputPath = path.join(blogDir, `${post.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`  ✓ Generated: public/blog/${post.slug}.html`);
  }

  console.log(`\n✅ Successfully generated ${posts.length} blog pages!`);
}

generateBlogPages().catch((error) => {
  console.error('❌ Failed to generate blog pages:', error);
  console.error('Build will continue, but blog pages will not have custom meta tags');
  // Don't exit with error code - allow build to continue
  process.exit(0);
});
