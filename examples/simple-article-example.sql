-- Example: Simple Article Format
-- This shows a basic article with text, images, and quotes

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  post_type,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published,
  content_blocks
) VALUES (
  'A Day in the Life of a Maldivian Poet',
  'day-in-life-maldivian-poet',
  'Experience the daily rhythms of island life through the eyes of a poet, where inspiration flows as freely as the ocean tides.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1/blog/poet-beach-sunset',
  'Hawla Riza',
  NOW(),
  'article',
  FALSE,
  ARRAY['poetry', 'maldives', 'life', 'writing', 'inspiration'],
  'Experience a day in the life of a Maldivian poet, where the ocean, islands, and daily rhythms inspire creative expression.',
  ARRAY['Maldivian poet', 'poetry', 'island life', 'creative writing', 'inspiration'],
  6,
  TRUE,
  '[
    {
      "type": "text",
      "content": "<p>The sun rises over the Indian Ocean at 6 AM, painting the sky in shades of coral and gold. This is my favorite time of day - when the world is quiet and the words flow most freely.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Morning Reflections"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_800/v1/blog/morning-beach-walk",
      "caption": "Early morning walk along the shore",
      "alt": "Sunrise on a Maldivian beach"
    },
    {
      "type": "text",
      "content": "<p>I begin each day with a walk along the beach. The rhythm of the waves mirrors the rhythm of poetry - constant yet ever-changing. With each step on the sand, I collect not shells, but words that wash up from the depths of my consciousness.</p>"
    },
    {
      "type": "quote",
      "text": "The ocean whispers verses that only the heart can translate",
      "author": "Morning Journal Entry"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Midday Creation"
    },
    {
      "type": "text",
      "content": "<p>By noon, I''m at my writing desk - a simple table facing the turquoise lagoon. The heat of the day brings a different kind of energy. This is when I refine the raw inspiration from morning into polished verses.</p><p>The process is slow, deliberate. Each word must earn its place. Each line must breathe with the rhythm of island life.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Afternoon Community"
    },
    {
      "type": "text",
      "content": "<p>The afternoon is for connection. I visit the local tea shop, where stories are exchanged as freely as smiles. The elderly share tales of the old days, mothers discuss their children, fishermen recount their morning''s catch.</p><p>These conversations are research, but more importantly, they''re life. Poetry doesn''t exist in isolation - it grows from the soil of shared human experience.</p>"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_800/v1/blog/local-tea-shop",
      "caption": "Afternoon tea at the local gathering place",
      "alt": "People sharing stories at a traditional Maldivian tea shop"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Evening Inspiration"
    },
    {
      "type": "text",
      "content": "<p>As the sun sets, I return to the beach. Sunset is different from sunrise - it''s a completion, a reflection. The day''s experiences settle into my mind like sand in still water.</p><p>Sometimes I write during these golden hours. Other times, I simply observe. Not every moment needs to be captured in words - some are meant to be lived fully, stored in memory, and perhaps emerge in poetry months or years later.</p>"
    },
    {
      "type": "quote",
      "text": "To heal in paradise is to find the rhythm between doing and being",
      "author": "Evening Reflection"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Night''s Promise"
    },
    {
      "type": "text",
      "content": "<p>Night in the Maldives is magical. The stars are impossibly bright, undimmed by city lights. I often sit outside, listening to the waves, watching the sky.</p><p>This is when I read - other poets, philosophers, storytellers. I feed my creative spirit with the words of those who came before, knowing that tomorrow I''ll wake and the cycle will begin again.</p>"
    },
    {
      "type": "divider"
    },
    {
      "type": "text",
      "content": "<p>This is the life of a poet in paradise - simple, purposeful, and endlessly inspiring. Every day brings new words, new insights, new ways to capture the essence of healing and beauty that surrounds me.</p><p>If you''re interested in experiencing these reflections in verse, you can find them in my collection, <em>Heal in Paradise</em>.</p>"
    }
  ]'::jsonb
);
