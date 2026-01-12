import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  // Add debug header to verify function is running
  res.setHeader('X-Blog-Handler', 'active');

  if (typeof slug !== 'string') {
    return res.status(400).send('Invalid slug');
  }

  // Check if this is a social media crawler or regular browser
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  // Add header to indicate if crawler was detected
  res.setHeader('X-Is-Crawler', isSocialCrawler ? 'yes' : 'no');

  // If not a social media crawler, let the SPA handle it
  if (!isSocialCrawler) {
    // For regular browsers, just return the normal index.html
    // and let React handle the routing
    try {
      const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
      const response = await fetch(`${baseUrl}/index.html`);
      const html = await response.text();

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (e) {
      return res.redirect(307, '/');
    }
  }

  try {
    // Fetch blog post data using direct REST API call instead of Supabase client
    // This is more reliable in serverless environments
    const supabaseUrl = 'https://qgcgzoysvxpnjegijmmu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const posts = await response.json();
    const post = posts && posts.length > 0 ? posts[0] : null;

    if (!post) {
      console.error('Blog post not found for slug:', slug);
      console.error('Response status:', response.status);

      // Add header to indicate post was not found
      res.setHeader('X-Post-Found', 'no');
      res.setHeader('X-Error', `Post not found for slug: ${slug}`);

      // For crawlers, return index.html with default tags instead of redirecting
      // This prevents Facebook from seeing a 307 redirect
      const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
      const htmlResponse = await fetch(`${baseUrl}/index.html`);
      const html = await htmlResponse.text();

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // Add header to indicate post was found
    res.setHeader('X-Post-Found', 'yes');
    res.setHeader('X-Post-Title', post.title.substring(0, 100));

    const postUrl = `https://hawlariza.com/blog/${post.slug}`;
    const shareImage = post.featured_image || DEFAULT_IMAGE;

    // Fetch the base index.html file
    let html: string;

    // Fetch index.html - always use fetch for reliability in Vercel
    const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
    res.setHeader('X-Html-Source', `fetch:${baseUrl}/index.html`);

    const htmlResponse = await fetch(`${baseUrl}/index.html`, {
      headers: {
        'User-Agent': 'Vercel-Serverless-Function',
      },
    });

    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch index.html: ${htmlResponse.status}`);
    }

    html = await htmlResponse.text();

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
