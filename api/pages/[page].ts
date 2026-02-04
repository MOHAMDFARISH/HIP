import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

// Map page paths to database slugs
const PAGE_MAPPING: Record<string, string> = {
  '': 'home',
  'home': 'home',
  'book': 'book',
  'author': 'author',
  'blog': 'blog',
  'reviews': 'reviews',
  'media': 'media',
  'faq': 'faq',
  'contact': 'contact',
};

// Generate page-specific structured data
function generateStructuredData(pageSlug: string, pageUrl: string, pageTitle: string, pageDescription: string, pageImage: string) {
  const schemas: any[] = [];

  switch (pageSlug) {
    case 'home':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Heal in Paradise',
        description: pageDescription,
        url: pageUrl,
        logo: { '@type': 'ImageObject', url: pageImage },
        founder: { '@type': 'Person', name: 'Hawla Riza' },
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: pageUrl,
        name: 'Heal in Paradise',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${pageUrl}/blog?search={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Heal in Paradise',
        author: { '@type': 'Person', name: 'Hawla Riza' },
        isbn: '978-0-99-702549-1',
        description: pageDescription,
        image: pageImage,
        url: pageUrl,
      });
      break;

    case 'book':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Heal in Paradise',
        author: { '@type': 'Person', name: 'Hawla Riza', url: 'https://hawlariza.com/author' },
        isbn: '978-0-99-702549-1',
        description: pageDescription,
        image: pageImage,
        url: pageUrl,
        publisher: { '@type': 'Organization', name: 'Heal in Paradise' },
        inLanguage: 'en',
        genre: ['Poetry', 'Maldivian Literature', 'Self-Help'],
        offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', price: 'Contact for pricing', priceCurrency: 'USD' },
      });
      break;

    case 'author':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Hawla Riza',
        description: pageDescription,
        image: pageImage,
        url: pageUrl,
        jobTitle: 'Poet and Author',
        nationality: 'Maldivian',
        knowsAbout: ['Poetry', 'Creative Writing', 'Maldivian Literature', 'Mental Wellness'],
        sameAs: ['https://hawlariza.com'],
      });
      break;

    case 'blog':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        mainEntity: { '@type': 'Blog', name: 'Heal in Paradise Blog', publisher: { '@type': 'Organization', name: 'Heal in Paradise' } },
      });
      break;

    case 'faq':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Heal in Paradise?',
            acceptedAnswer: { '@type': 'Answer', text: 'Heal in Paradise is the first-ever Maldivian literary souvenir - a collection of poetry by Hawla Riza about hope, healing, and island life in the Maldives.' },
          },
          {
            '@type': 'Question',
            name: 'How can I order Heal in Paradise?',
            acceptedAnswer: { '@type': 'Answer', text: 'You can order Heal in Paradise through our website at hawlariza.com/book. We offer worldwide shipping.' },
          },
          {
            '@type': 'Question',
            name: 'Who is Hawla Riza?',
            acceptedAnswer: { '@type': 'Answer', text: 'Hawla Riza is a Maldivian poet and the author of Heal in Paradise. She writes about mental wellness, island life, and the Maldivian experience.' },
          },
        ],
      });
      break;

    case 'contact':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        mainEntity: { '@type': 'Organization', name: 'Heal in Paradise', url: 'https://hawlariza.com' },
      });
      break;

    case 'reviews':
    case 'media':
      schemas.push({
        '@context': 'https://schema.org',
        '@type': pageSlug === 'media' ? 'CollectionPage' : 'WebPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        ...(pageSlug === 'reviews' && { mainEntity: { '@type': 'Book', name: 'Heal in Paradise', author: { '@type': 'Person', name: 'Hawla Riza' } } }),
        ...(pageSlug === 'media' && { about: { '@type': 'Book', name: 'Heal in Paradise', author: { '@type': 'Person', name: 'Hawla Riza' } } }),
      });
      break;
  }

  return schemas;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { page } = req.query;
  const pagePath = typeof page === 'string' ? page : '';
  const pageSlug = PAGE_MAPPING[pagePath];

  if (!pageSlug) {
    return res.redirect(307, '/');
  }

  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  res.setHeader('X-Page-Handler', pageSlug);
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
      .eq('page_slug', pageSlug)
      .eq('is_active', true)
      .single();

    const pageUrl = pageData?.canonical_url || `https://hawlariza.com/${pagePath}`;
    const pageTitle = pageData?.page_title || 'Heal in Paradise';
    const pageDescription = pageData?.og_description || 'The first Maldivian literary souvenir';
    const pageImage = pageData?.og_image || 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png';
    const ogType = pageData?.og_type || 'website';

    res.setHeader('X-Metadata-Source', pageData ? 'database' : 'default');
    if (pageError) {
      res.setHeader('X-DB-Error', pageError.message);
    }

    // Fetch base HTML
    const baseUrl = `https://${req.headers.host || 'hawlariza.com'}`;
    const htmlResponse = await fetch(`${baseUrl}/index.html`, {
      headers: { 'User-Agent': 'Vercel-Serverless-Function' },
    });

    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch index.html: ${htmlResponse.status}`);
    }

    let html = await htmlResponse.text();

    // Generate structured data
    const schemas = generateStructuredData(pageSlug, pageUrl, pageTitle, pageDescription, pageImage);

    // Add breadcrumb
    const breadcrumbPath = pagePath ? [
      { position: 1, name: 'Home', item: 'https://hawlariza.com' },
      { position: 2, name: pageTitle, item: pageUrl },
    ] : [];

    if (breadcrumbPath.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbPath.map(item => ({ '@type': 'ListItem', ...item })),
      });
    }

    const jsonLdScript = schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n');

    // Enhanced meta tags
    const keywords = {
      home: 'Heal in Paradise, Maldivian poetry, Hawla Riza, literary souvenir, mental wellness, island life',
      book: 'Maldivian poetry, Heal in Paradise, Hawla Riza, island life, mental wellness, poetry book',
      author: 'Hawla Riza, Maldivian poet, Maldivian author, poetry, creative writing',
      blog: 'Heal in Paradise blog, poetry, Maldivian culture, mental wellness, literature',
      reviews: 'Heal in Paradise reviews, book reviews, reader testimonials',
      media: 'Heal in Paradise media, press coverage, Hawla Riza interviews',
      faq: 'Heal in Paradise FAQ, frequently asked questions, ordering information',
      contact: 'contact Hawla Riza, book inquiries, speaking engagements',
    }[pageSlug] || 'Heal in Paradise';

    const enhancedMeta = `
    <meta name="keywords" content="${keywords}" />
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
    console.error(`Error in ${pageSlug} page handler:`, error);
    res.status(500).send('Internal Server Error');
  }
}
