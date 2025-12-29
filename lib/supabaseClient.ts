import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Optional for external links
  featured_image: string;
  author: string;
  published_date: string;
  updated_date?: string;
  is_external: boolean;
  external_url?: string; // For external news articles
  external_source?: string; // e.g., "BBC News", "The Guardian"
  tags: string[];
  meta_description: string;
  meta_keywords: string[];
  read_time_minutes?: number;
  is_published: boolean;
  views_count: number;
  created_at: string;
}
