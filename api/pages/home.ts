import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

// Default fallback metadata
const DEFAULT_METADATA = {
  pageUrl: 'https://hawlariza.com',
  pageTitle: 'Heal in Paradise: The First Maldivian Literary Souvenir',
  pageDescription: 'Order the first-ever Maldivian literary souvenir. A powerful collection of Maldivian poetry by Hawla Riza about hope, healing, and island life.',
  pageImage: 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  ogType: 'book',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  res.setHeader('X-Page-Handler', 'home');
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
    // Fetch page metadata from database
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: pageData, error: pageError } = await supabase
      .from('page_metadata')
      .select('*')
      .eq('page_slug', 'home')
      .eq('is_active', true)
      .single();

    // Use database metadata or fallback to defaults
    const pageUrl = pageData?.canonical_url || DEFAULT_METADATA.pageUrl;
    const pageTitle = pageData?.page_title || DEFAULT_METADATA.pageTitle;
    const pageDescription = pageData?.og_description || DEFAULT_METADATA.pageDescription;
    const pageImage = pageData?.og_image || DEFAULT_METADATA.pageImage;
    const ogType = pageData?.og_type || DEFAULT_METADATA.ogType;

    res.setHeader('X-Metadata-Source', pageData ? 'database' : 'default');
    if (pageError) {
      res.setHeader('X-DB-Error', pageError.message);
    }

    // For crawlers, fetch and modify the HTML with homepage-specific OG tags
    const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
    const htmlResponse = await fetch(`${baseUrl}/index.html`, {
      headers: {
        'User-Agent': 'Vercel-Serverless-Function',
      },
    });

    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch index.html: ${htmlResponse.status}`);
    }

    let html = await htmlResponse.text();

    // Generate structured data (JSON-LD) for SEO and AI search
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Heal in Paradise',
      description: pageDescription,
      url: pageUrl,
      logo: {
        '@type': 'ImageObject',
        url: pageImage,
      },
      founder: {
        '@type': 'Person',
        name: 'Hawla Riza',
      },
      keywords: 'Maldivian poetry, literary souvenir, mental wellness, island life, Hawla Riza',
    };

    const webSiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: pageUrl,
      name: 'Heal in Paradise',
      description: pageDescription,
      publisher: {
        '@type': 'Organization',
        name: 'Heal in Paradise',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${pageUrl}/blog?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    const bookSchema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: 'Heal in Paradise',
      author: {
        '@type': 'Person',
        name: 'Hawla Riza',
      },
      isbn: '978-0-99-702549-1',
      description: pageDescription,
      image: pageImage,
      url: pageUrl,
    };

    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
<script type="application/ld+json">${JSON.stringify(webSiteSchema)}</script>
<script type="application/ld+json">${JSON.stringify(bookSchema)}</script>`;

    // Enhanced meta tags for AI search
    const enhancedMeta = `
    <meta name="keywords" content="Heal in Paradise, Maldivian poetry, Hawla Riza, literary souvenir, mental wellness, island life, Maldives, poetry book, first Maldivian literary souvenir" />
    <meta name="author" content="Hawla Riza" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow" />
    <meta name="publisher" content="Heal in Paradise" />`;

    // Insert structured data and enhanced meta before </head>
    html = html.replace('</head>', `${enhancedMeta}\n${jsonLdScript}\n</head>`);

    // Replace meta tags with homepage-specific ones
    html = html
      // Update title
      .replace(
        /<title>.*?<\/title>/,
        `<title>${pageTitle}</title>`
      )
      // Update description
      .replace(
        /<meta name="description" content="[^"]*".*?>/,
        `<meta name="description" content="${pageDescription}" />`
      )
      // Update canonical URL
      .replace(
        /<link rel="canonical" href="[^"]*".*?>/,
        `<link rel="canonical" href="${pageUrl}" />`
      )
      // Update Open Graph type
      .replace(
        /<meta property="og:type" content="[^"]*".*?>/,
        `<meta property="og:type" content="${ogType}" />`
      )
      // Update Open Graph URL
      .replace(
        /<meta property="og:url" content="[^"]*".*?>/,
        `<meta property="og:url" content="${pageUrl}" />`
      )
      // Update Open Graph title
      .replace(
        /<meta property="og:title" content="[^"]*".*?>/,
        `<meta property="og:title" content="${pageTitle}" />`
      )
      // Update Open Graph description
      .replace(
        /<meta property="og:description" content="[^"]*".*?>/,
        `<meta property="og:description" content="${pageDescription}" />`
      )
      // Update Open Graph image
      .replace(
        /<meta property="og:image" content="[^"]*".*?>/,
        `<meta property="og:image" content="${pageImage}" />`
      )
      // Update Twitter URL
      .replace(
        /<meta property="twitter:url" content="[^"]*".*?>/,
        `<meta property="twitter:url" content="${pageUrl}" />`
      )
      // Update Twitter title
      .replace(
        /<meta name="twitter:title" content="[^"]*".*?>/,
        `<meta name="twitter:title" content="${pageTitle}" />`
      )
      // Update Twitter description
      .replace(
        /<meta name="twitter:description" content="[^"]*".*?>/,
        `<meta name="twitter:description" content="${pageDescription}" />`
      )
      // Update Twitter image
      .replace(
        /<meta name="twitter:image" content="[^"]*".*?>/,
        `<meta name="twitter:image" content="${pageImage}" />`
      );

    // Return the modified HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in home page handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
