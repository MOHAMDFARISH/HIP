import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qgcgzoysvxpnjegijmmu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY2d6b3lzdnhwbmplZ2lqbW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjI0MDksImV4cCI6MjA3MzU5ODQwOX0.xqfhDOi15RQk_LZ8_FEEpyuYZFbFGVLYU7pYjoxLtEY'
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, is_published, featured_image')
      .order('published_date', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: error.message,
        code: error.code,
        details: error.details,
      });
    }

    return res.status(200).json({
      total: data?.length || 0,
      posts: data || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Exception occurred',
      message: error?.message || String(error),
    });
  }
}
