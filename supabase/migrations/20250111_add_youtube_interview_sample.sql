-- Add real YouTube interview sample
-- URL: https://youtu.be/rMh3UBj56jo?si=fParQityZdv5jrNG

INSERT INTO media_items (
  title,
  description,
  media_type,
  source_type,
  embed_url,
  external_url,
  thumbnail_url,
  source_name,
  published_date,
  duration_minutes,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Author Interview: Heal in Paradise',
  'Interview with Hawla Riza discussing her poetry collection and the inspiration behind Heal in Paradise.',
  'interview',
  'youtube',
  'https://www.youtube.com/watch?v=rMh3UBj56jo',
  'https://youtu.be/rMh3UBj56jo',
  NULL,  -- YouTube provides thumbnail automatically
  'YouTube',
  NOW(),
  NULL,  -- Update with actual duration if known
  TRUE,  -- Featured interview
  TRUE,
  1
);
