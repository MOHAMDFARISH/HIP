import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hawlariza.com/</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://hawlariza.com/about-the-book</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://hawlariza.com/pre-order</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://hawlariza.com/meet-hawla-riza</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://hawlariza.com/poetry-samples</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://hawlariza.com/contact</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(sitemap);
}