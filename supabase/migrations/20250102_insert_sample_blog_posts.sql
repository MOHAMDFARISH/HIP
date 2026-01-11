-- Insert sample blog posts with both internal and external content

-- Internal blog post 1
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  published_date,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Finding Healing Through Poetry: A Journey in the Maldives',
  'finding-healing-through-poetry',
  'Discover how poetry became a powerful tool for healing and self-discovery in the breathtaking landscape of the Maldives.',
  '<p>Poetry has always been more than just words on a page—it''s a journey of the soul. In the pristine islands of the Maldives, surrounded by turquoise waters and endless horizons, I found that poetry became my compass through life''s most challenging moments.</p>

<h2>The Power of Words</h2>
<p>When we write, we create a safe space to explore our deepest emotions. Each line becomes a stepping stone on the path to understanding ourselves better. In "Heal in Paradise," I share this journey with you.</p>

<h2>Nature as Inspiration</h2>
<p>The Maldives offers more than just stunning beaches—it provides a canvas for introspection. The rhythm of the waves, the whisper of palm trees, and the vast expanse of the ocean all contribute to a healing atmosphere that nurtures creativity.</p>

<h2>Your Own Journey</h2>
<p>Everyone''s healing journey is unique. Whether you''re dealing with loss, searching for purpose, or simply seeking peace, poetry can be your companion. Let the words guide you toward your own paradise of healing.</p>',
  NULL,  -- Will use default image
  'Hawla Riza',
  NOW(),
  FALSE,
  ARRAY['poetry', 'healing', 'maldives', 'wellness', 'self-discovery'],
  'Explore how poetry became a powerful tool for healing and self-discovery in the Maldives. A personal journey through words and nature.',
  ARRAY['poetry', 'healing', 'Maldives', 'wellness', 'mental health', 'self-discovery'],
  5,
  TRUE
);

-- Internal blog post 2
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  published_date,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'The Therapeutic Benefits of Creative Writing',
  'therapeutic-benefits-creative-writing',
  'Explore the science-backed benefits of creative writing for mental health and emotional well-being.',
  '<p>Creative writing isn''t just an artistic pursuit—it''s a powerful therapeutic tool backed by scientific research. Studies have shown that expressive writing can significantly improve mental health, reduce stress, and promote emotional healing.</p>

<h2>Science Meets Art</h2>
<p>Research from leading universities has demonstrated that regular journaling and creative writing can:</p>
<ul>
<li>Reduce symptoms of anxiety and depression</li>
<li>Improve immune system function</li>
<li>Enhance emotional processing and self-awareness</li>
<li>Lower blood pressure and improve sleep quality</li>
</ul>

<h2>Making It a Practice</h2>
<p>You don''t need to be a professional writer to experience these benefits. Start with just 15 minutes a day, writing freely about your thoughts and feelings. There''s no right or wrong way—just let the words flow.</p>

<h2>Poetry as Medicine</h2>
<p>Poetry, in particular, offers a unique form of emotional expression. Its condensed nature forces us to distill our experiences into their essence, creating powerful moments of clarity and understanding.</p>',
  NULL,  -- Will use default image
  'Hawla Riza',
  NOW() - INTERVAL '7 days',
  FALSE,
  ARRAY['writing', 'therapy', 'mental-health', 'wellness', 'self-care'],
  'Discover the science-backed therapeutic benefits of creative writing and how it can improve your mental health and emotional well-being.',
  ARRAY['creative writing', 'therapy', 'mental health', 'wellness', 'self-care', 'journaling'],
  6,
  TRUE
);

-- External blog post 1 (Featured article from external source)
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  is_external,
  external_url,
  external_source,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'The Maldives: A Paradise for Mindfulness and Meditation',
  'maldives-mindfulness-meditation',
  'An in-depth look at how the Maldives has become a premier destination for wellness retreats and mindfulness practices.',
  NULL,  -- Will use default image
  'Various Authors',
  NOW() - INTERVAL '14 days',
  TRUE,
  'https://www.example.com/maldives-wellness',
  'Wellness Travel Magazine',
  ARRAY['maldives', 'meditation', 'wellness', 'travel', 'mindfulness'],
  'Explore how the Maldives has become a top destination for wellness retreats and mindfulness practices.',
  ARRAY['Maldives', 'meditation', 'wellness', 'travel', 'mindfulness', 'retreat'],
  8,
  TRUE
);

-- Internal blog post 3
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  published_date,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Behind the Scenes: Writing "Heal in Paradise"',
  'behind-scenes-heal-in-paradise',
  'A personal account of the journey behind creating this collection of poetry, from inspiration to publication.',
  '<p>Every book has a story behind it, and "Heal in Paradise" is no exception. This collection was born from a deeply personal journey of healing, discovery, and transformation in the Maldives.</p>

<h2>The Beginning</h2>
<p>It started with a single poem, written on a beach at sunset. The words flowed naturally, like the waves lapping at the shore. I realized I had something important to share—not just about my own healing, but about the universal human experience of finding peace.</p>

<h2>The Creative Process</h2>
<p>Writing this collection took over two years. Each poem was carefully crafted, revised, and refined. Some came easily, pouring out in moments of inspiration. Others required patience and persistence, emerging slowly like pearls from oysters.</p>

<h2>Cultural Connections</h2>
<p>Being Maldivian, I wanted to weave elements of our culture and landscape into the poetry. The ocean, the atolls, the tropical sunsets—these aren''t just backdrop; they''re characters in their own right, each playing a role in the healing narrative.</p>

<h2>A Message of Hope</h2>
<p>My hope is that readers will find their own reflections in these poems. Whether you''re seeking healing, inspiration, or simply a moment of peace, I invite you to journey with me through these pages.</p>',
  NULL,  -- Will use default image
  'Hawla Riza',
  NOW() - INTERVAL '21 days',
  FALSE,
  ARRAY['poetry', 'writing', 'maldives', 'book', 'creative-process'],
  'Go behind the scenes of the creation of "Heal in Paradise" and discover the journey from inspiration to publication.',
  ARRAY['poetry', 'writing', 'Maldives', 'book', 'creative process', 'author'],
  7,
  TRUE
);

-- External blog post 2 (Featured article on poetry and mental health)
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  is_external,
  external_url,
  external_source,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Poetry as a Tool for Mental Health: What Science Says',
  'poetry-mental-health-science',
  'Recent research reveals how reading and writing poetry can significantly impact mental health and emotional well-being.',
  NULL,  -- Will use default image
  'Dr. Sarah Johnson',
  NOW() - INTERVAL '30 days',
  TRUE,
  'https://www.example.com/poetry-mental-health',
  'Psychology Today',
  ARRAY['poetry', 'mental-health', 'science', 'research', 'therapy'],
  'Discover what scientific research reveals about poetry''s impact on mental health and emotional healing.',
  ARRAY['poetry', 'mental health', 'science', 'research', 'therapy', 'healing'],
  10,
  TRUE
);

-- Internal blog post 4
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  published_date,
  is_external,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Maldivian Culture and the Art of Storytelling',
  'maldivian-culture-storytelling',
  'Explore the rich tradition of storytelling in Maldivian culture and how it shapes our understanding of healing and community.',
  '<p>In the Maldives, storytelling has been passed down through generations, a vibrant thread connecting our past to our present. These stories aren''t just entertainment—they''re vessels of wisdom, healing, and cultural identity.</p>

<h2>Oral Traditions</h2>
<p>Before written language dominated, our ancestors shared knowledge through spoken word. Elders would gather children under the palms, weaving tales of the sea, of ancestors, and of life lessons that transcended time.</p>

<h2>Poetry in Daily Life</h2>
<p>Maldivian poetry, or "raivaru," has always been integral to our culture. From love songs to lullabies, from celebrations to mourning, poetry marks every significant moment in our lives. It''s how we process emotions and connect with our deeper selves.</p>

<h2>The Healing Circle</h2>
<p>Traditional Maldivian storytelling circles served as community therapy sessions. People would share their struggles through metaphor and verse, finding solace in the collective wisdom of the group. This ancient practice mirrors modern group therapy techniques.</p>

<h2>Preserving Our Heritage</h2>
<p>As the world becomes more connected, it''s crucial to preserve these traditions. Through poetry and storytelling, we keep our culture alive while adapting it to contemporary needs.</p>',
  NULL,  -- Will use default image
  'Hawla Riza',
  NOW() - INTERVAL '45 days',
  FALSE,
  ARRAY['maldives', 'culture', 'storytelling', 'tradition', 'heritage'],
  'Discover the rich tradition of storytelling in Maldivian culture and its role in healing and community.',
  ARRAY['Maldives', 'culture', 'storytelling', 'tradition', 'heritage', 'poetry'],
  8,
  TRUE
);

-- External blog post 3 (Featured article on island wellness)
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  featured_image,
  author,
  published_date,
  is_external,
  external_url,
  external_source,
  tags,
  meta_description,
  meta_keywords,
  read_time_minutes,
  is_published
) VALUES (
  'Island Living and Mental Wellness: A Global Perspective',
  'island-living-mental-wellness',
  'How island communities around the world approach mental health and wellness, with insights from tropical paradises.',
  NULL,  -- Will use default image
  'Global Wellness Institute',
  NOW() - INTERVAL '60 days',
  TRUE,
  'https://www.example.com/island-wellness',
  'National Geographic',
  ARRAY['wellness', 'islands', 'mental-health', 'culture', 'lifestyle'],
  'Explore how island communities worldwide approach mental wellness and what we can learn from tropical paradises.',
  ARRAY['wellness', 'islands', 'mental health', 'culture', 'lifestyle', 'global'],
  12,
  TRUE
);
