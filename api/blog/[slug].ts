import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  'https://qgcgzoysvxpnjegijmmu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY'
);

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).send('Invalid slug');
  }

  try {
    // Fetch blog post data
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !post) {
      console.error('Error fetching blog post:', error);
      // Return default index.html if post not found
      return res.redirect(307, '/');
    }

    const postUrl = `https://hawlariza.com/blog/${post.slug}`;
    const shareImage = post.featured_image || DEFAULT_IMAGE;

    // Fetch the base index.html file
    let html: string;

    // Try to read from the deployed static files first
    try {
      // Check if we're in production and can access the dist folder
      if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
        html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      } else {
        // Fallback: make an internal request to get the index.html
        const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
        const response = await fetch(`${baseUrl}/index.html`);
        html = await response.text();
      }
    } catch (e) {
      console.error('Error reading index.html:', e);
      // Last resort: fetch from the main domain
      const response = await fetch('https://hawlariza.com/index.html');
      html = await response.text();
    }

    // Escape HTML entities in content
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

    // Replace meta tags with blog post-specific ones
    html = html
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

    // Return the modified HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in blog post handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
