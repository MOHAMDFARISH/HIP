import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';
  const isSocialCrawler = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|pinterest/i.test(userAgent);

  res.setHeader('X-Page-Handler', 'author');
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
    // For crawlers, fetch and modify the HTML with author-specific OG tags
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

    // Author page specific metadata
    const pageUrl = 'https://hawlariza.com/author';
    const pageTitle = 'About Hawla Riza | Maldivian Poet & Author';
    const pageDescription = 'Meet Hawla Riza, the Maldivian poet behind Heal in Paradise. Discover her journey, inspirations, and the story behind the first Maldivian literary souvenir.';
    const pageImage = 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png'; // Author photo/default image

    // Replace meta tags with author page-specific ones
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
        `<meta property="og:type" content="profile" />`
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
    console.error('Error in author page handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
