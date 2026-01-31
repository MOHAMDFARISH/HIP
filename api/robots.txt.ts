import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const robots = `# robots.txt for hawlariza.com
# Optimized for search engines and AI crawlers

# Google and general crawlers
User-agent: *
Allow: /
Crawl-delay: 1

# Allow all AI crawlers explicitly
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Slurp
Allow: /

# Block any admin or API routes from indexing
Disallow: /api/
Disallow: /admin/

# Sitemap location
Sitemap: https://www.hawlariza.com/sitemap.xml
Sitemap: https://hawlariza.com/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
  res.status(200).send(robots);
}