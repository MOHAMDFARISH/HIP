import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filter, limit, offset, tag } = req.query;

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_date', { ascending: false });

    // Filter by internal/external
    if (filter === 'internal') {
      query = query.eq('is_external', false);
    } else if (filter === 'external') {
      query = query.eq('is_external', true);
    }

    // Filter by tag
    if (tag && typeof tag === 'string') {
      query = query.contains('tags', [tag]);
    }

    // Apply pagination
    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit, 10);
      query = query.limit(limitNum);
    }

    if (offset && typeof offset === 'string') {
      const offsetNum = parseInt(offset, 10);
      query = query.range(offsetNum, offsetNum + (limit ? parseInt(limit as string, 10) : 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }

    return res.status(200).json({ posts: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
