import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest|googlebot/i.test(userAgent);

  res.setHeader('X-Page-Handler', 'homepage');
  res.setHeader('X-Is-Crawler', isSocialCrawler ? 'yes' : 'no');
  res.setHeader('X-User-Agent', userAgent);

  // Read base HTML from filesystem
  const htmlPath = path.join(process.cwd(), 'index.html');

  try {
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // If not a crawler, just return the static HTML
    if (!isSocialCrawler) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // For crawlers, enhance with database metadata
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: pageData } = await supabase
      .from('page_metadata')
      .select('*')
      .eq('page_slug', 'home')
      .eq('is_active', true)
      .single();

    const pageUrl = pageData?.canonical_url || 'https://hawlariza.com/';
    const pageTitle = pageData?.page_title || 'Heal in Paradise: The First Maldivian Literary Souvenir';
    const pageDescription = pageData?.og_description || 'The first Maldivian literary souvenir - a powerful collection of poetry by Hawla Riza about hope, healing, and island life in the Maldives.';
    const pageImage = pageData?.og_image || 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png';
    const ogType = pageData?.og_type || 'website';

    // Generate structured data for homepage
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Heal in Paradise',
        description: pageDescription,
        url: pageUrl,
        logo: { '@type': 'ImageObject', url: pageImage },
        founder: { '@type': 'Person', name: 'Hawla Riza' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: pageUrl,
        name: 'Heal in Paradise',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${pageUrl}/blog?search={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Heal in Paradise',
        author: { '@type': 'Person', name: 'Hawla Riza' },
        isbn: '978-0-99-702549-1',
        description: pageDescription,
        image: pageImage,
        url: pageUrl,
      },
    ];

    const jsonLdScript = schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n');

    // Enhanced meta tags
    const enhancedMeta = `
    <meta name="keywords" content="Heal in Paradise, Maldivian poetry, Hawla Riza, literary souvenir, mental wellness, island life" />
    <meta name="author" content="Hawla Riza" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow" />`;

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
    console.error('Error in homepage handler:', error);
    res.setHeader('Content-Type', 'text/plain');
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
}
