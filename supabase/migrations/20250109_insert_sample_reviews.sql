-- Insert sample reviews for "Heal in Paradise"

-- Review 1: With photo
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Aisha Mohamed',
  'Poetry Enthusiast',
  'Heal in Paradise is a beautifully crafted collection that speaks to the soul. Each poem transported me to the serene beaches of the Maldives, and I found myself healing with every page.',
  5,
  NULL,  -- Optional: Add photo URL here
  'Malé, Maldives',
  TRUE,  -- Featured review
  TRUE,
  1
);

-- Review 2: Without photo
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Sarah Thompson',
  'Book Club Member',
  'As someone who loves poetry, this collection resonated deeply with me. Hawla''s words are both powerful and gentle, offering comfort and inspiration in equal measure.',
  5,
  NULL,
  'London, UK',
  FALSE,
  TRUE,
  2
);

-- Review 3: Simple review
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Ahmed Hassan',
  NULL,
  'A must-read for anyone seeking peace and healing through poetry. The imagery of paradise combined with profound emotional depth makes this collection truly special.',
  4,
  NULL,
  'Dubai, UAE',
  FALSE,
  TRUE,
  3
);

-- Review 4: Detailed review
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Maya Patel',
  'Literature Teacher',
  'I bought this for my students and they absolutely loved it. The poems are accessible yet profound, making them perfect for discussion and reflection. Highly recommended!',
  5,
  NULL,
  'Mumbai, India',
  FALSE,
  TRUE,
  4
);

-- Review 5: Personal testimony
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'Fatima Ali',
  NULL,
  'This book came into my life at exactly the right moment. The poems about healing helped me through a difficult time, and I''m grateful for Hawla''s gift with words.',
  5,
  NULL,
  'Addu City, Maldives',
  TRUE,  -- Featured
  TRUE,
  5
);

-- Review 6: Without rating
INSERT INTO reviews (
  reviewer_name,
  reviewer_title,
  review_text,
  rating,
  reviewer_photo,
  reviewer_location,
  is_featured,
  is_published,
  display_order
) VALUES (
  'James Wilson',
  'Travel Writer',
  'Beautiful poetry that captures the essence of the Maldives and the human experience. A wonderful addition to any poetry collection.',
  NULL,  -- No rating
  NULL,
  'New York, USA',
  FALSE,
  TRUE,
  6
);
