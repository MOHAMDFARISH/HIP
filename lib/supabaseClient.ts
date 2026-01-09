import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContentBlock {
  type: 'text' | 'image' | 'list' | 'gallery' | 'quote' | 'heading' | 'divider';
  [key: string]: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Optional for external links or legacy posts
  content_blocks?: ContentBlock[]; // New structured content format
  post_type?: string; // 'article', 'list', 'guide', 'gallery', etc.
  featured_image?: string; // Optional - will use default image if not provided
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

export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_title?: string;
  review_text: string;
  rating?: number;
  reviewer_photo?: string;
  reviewer_location?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'video' | 'interview' | 'article' | 'podcast';
  source_type: 'youtube' | 'youtube-short' | 'tv' | 'website' | 'social';
  embed_url?: string;
  external_url?: string;
  thumbnail_url?: string;
  source_name?: string;
  published_date?: string;
  duration_minutes?: number;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  views_count: number;
  created_at: string;
  updated_at?: string;
}
