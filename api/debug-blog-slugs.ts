import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Use environment variables like other endpoints
const supabaseUrl = process.env.SUPABASE_URL || 'https://qgcgzoysvxpnjegijmmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, is_published, featured_image, published_date')
      .order('published_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: 'Supabase query failed',
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
    }

    const published = data?.filter(p => p.is_published) || [];
    const unpublished = data?.filter(p => !p.is_published) || [];

    return res.status(200).json({
      total: data?.length || 0,
      published: published.length,
      unpublished: unpublished.length,
      posts: data || [],
      published_posts: published,
      unpublished_posts: unpublished,
    });
  } catch (error: any) {
    console.error('Exception in debug endpoint:', error);
    return res.status(500).json({
      error: 'Exception occurred',
      message: error?.message || String(error),
      stack: error?.stack?.substring(0, 500) || '',
    });
  }
}
