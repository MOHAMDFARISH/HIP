import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dmtolfhsv/image/upload/v1767116573/george-girnas-6RTn6HZD-RI-unsplash_mmmbm2.jpg';

// Use environment variables for Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize Supabase client inside handler to use latest env vars
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { slug } = req.query;

  res.setHeader('X-Blog-Handler', 'active');

  if (typeof slug !== 'string') {
    return res.status(400).send('Invalid slug');
  }

  // Check if this is a social media crawler or regular browser
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  res.setHeader('X-Is-Crawler', isSocialCrawler ? 'yes' : 'no');

  // If not a social media crawler, let the SPA handle it
  if (!isSocialCrawler) {
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
    // Fetch blog post data using Supabase SDK
    let post = null;
    let supabaseError = null;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        supabaseError = `Supabase error: ${error.message} (${error.code})`;
        console.error('Supabase query error:', error);
      } else if (data) {
        post = data;
        res.setHeader('X-Post-Found', 'yes');
        res.setHeader('X-Post-Title', post.title.substring(0, 100));
      } else {
        supabaseError = 'No data returned';
        console.log('Supabase query succeeded but no data:', { slug });
      }
    } catch (fetchError: any) {
      const errorMsg = fetchError?.message || String(fetchError);
      const stackTrace = fetchError?.stack?.substring(0, 100) || '';
      supabaseError = `Exception: ${errorMsg} | Stack: ${stackTrace}`;
      console.error('Failed to query Supabase:', {
        error: fetchError,
        message: fetchError?.message,
        stack: fetchError?.stack,
      });
    }

    if (!post) {
      console.error('Blog post not found for slug:', slug);
      console.error('Supabase error details:', supabaseError);

      // CRITICAL: For crawlers, DO NOT return homepage tags
      // This causes wrong OG tags to be scraped
      // Instead, return a proper 404 or redirect

      // Log for debugging
      res.setHeader('X-Post-Found', 'no');
      res.setHeader('X-Requested-Slug', slug);
      if (supabaseError) {
        const sanitizedError = supabaseError.replace(/[\r\n\t]/g, ' ').replace(/[^\x20-\x7E]/g, '');
        res.setHeader('X-Supabase-Error', sanitizedError);
      }

      // Return 404 instead of homepage content
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Blog Post Not Found</title>
          <meta property="og:title" content="Blog Post Not Found" />
        </head>
        <body>
          <h1>Blog Post Not Found</h1>
          <p>The blog post "${slug}" could not be found.</p>
          <p>This might be because:</p>
          <ul>
            <li>The post hasn't been published yet (is_published = false)</li>
            <li>The slug in the URL doesn't match the database slug</li>
            <li>The post was deleted</li>
          </ul>
          <p><a href="/blog">← Back to Blog</a></p>
        </body>
        </html>
      `);
    }

    // Post was found - prepare meta tags
    const postUrl = `https://hawlariza.com/blog/${post.slug}`;
    const shareImage = post.featured_image || DEFAULT_IMAGE;

    // Fetch the base index.html file
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

    let html = await htmlResponse.text();

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

    // Generate Article structured data (JSON-LD) for SEO and AI search
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.meta_description,
      image: shareImage,
      author: {
        '@type': 'Person',
        name: post.author || 'Hawla Riza',
        url: 'https://hawlariza.com/author',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Heal in Paradise',
        logo: {
          '@type': 'ImageObject',
          url: 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
        },
      },
      datePublished: post.published_date,
      dateModified: post.updated_at || post.published_date,
      url: postUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(', ') }),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://hawlariza.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://hawlariza.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: postUrl,
        },
      ],
    };

    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

    // Enhanced meta tags for AI search
    const keywords = post.tags ? post.tags.join(', ') : 'poetry, Maldives, mental wellness';
    const enhancedMeta = `
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(post.author || 'Hawla Riza')}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow" />
    <meta name="article:published_time" content="${post.published_date}" />
    <meta name="article:modified_time" content="${post.updated_at || post.published_date}" />
    <meta name="article:author" content="${escapeHtml(post.author || 'Hawla Riza')}" />`;

    // Insert structured data and enhanced meta before </head>
    html = html.replace('</head>', `${enhancedMeta}\n${jsonLdScript}\n</head>`);

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
