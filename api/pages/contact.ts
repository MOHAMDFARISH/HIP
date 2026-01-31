import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

// Default fallback metadata
const DEFAULT_METADATA = {
  pageUrl: 'https://hawlariza.com/contact',
  pageTitle: 'Contact | Heal in Paradise - Get in Touch',
  pageDescription: 'Contact Hawla Riza about Heal in Paradise. Reach out for book inquiries, speaking engagements, media requests, or general questions.',
  pageImage: 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
  ogType: 'website',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  res.setHeader('X-Page-Handler', 'contact');
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
      .eq('page_slug', 'contact')
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

    // For crawlers, fetch and modify the HTML
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

    // Generate ContactPage structured data (JSON-LD)
    const contactPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageTitle,
      description: pageDescription,
      url: pageUrl,
      mainEntity: {
        '@type': 'Organization',
        name: 'Heal in Paradise',
        url: 'https://hawlariza.com',
      },
    };

    const breadcrumb = {
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
          name: 'Contact',
          item: pageUrl,
        },
      ],
    };

    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(contactPageSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;

    // Enhanced meta tags for AI search
    const enhancedMeta = `
    <meta name="keywords" content="contact Hawla Riza, Heal in Paradise contact, book inquiries, speaking engagements, media requests" />
    <meta name="author" content="Hawla Riza" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow" />`;

    // Insert structured data and enhanced meta before </head>
    html = html.replace('</head>', `${enhancedMeta}\n${jsonLdScript}\n</head>`);

    // Replace meta tags
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
      .replace(/<meta name="description" content="[^"]*".*?>/, `<meta name="description" content="${pageDescription}" />`)
      .replace(/<link rel="canonical" href="[^"]*".*?>/, `<link rel="canonical" href="${pageUrl}" />`)
      .replace(/<meta property="og:type" content="[^"]*".*?>/, `<meta property="og:type" content="${ogType}" />`)
      .replace(/<meta property="og:url" content="[^"]*".*?>/, `<meta property="og:url" content="${pageUrl}" />`)
      .replace(/<meta property="og:title" content="[^"]*".*?>/, `<meta property="og:title" content="${pageTitle}" />`)
      .replace(/<meta property="og:description" content="[^"]*".*?>/, `<meta property="og:description" content="${pageDescription}" />`)
      .replace(/<meta property="og:image" content="[^"]*".*?>/, `<meta property="og:image" content="${pageImage}" />`)
      .replace(/<meta property="twitter:url" content="[^"]*".*?>/, `<meta property="twitter:url" content="${pageUrl}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*".*?>/, `<meta name="twitter:title" content="${pageTitle}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*".*?>/, `<meta name="twitter:description" content="${pageDescription}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*".*?>/, `<meta name="twitter:image" content="${pageImage}" />`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in contact page handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
