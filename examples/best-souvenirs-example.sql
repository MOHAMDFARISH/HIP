-- Example: "Best Souvenirs from Maldives" Article
-- This demonstrates how to create a list-style blog post with images, galleries, and structured content

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
  'Top 10 Best Souvenirs from the Maldives',
  'best-souvenirs-maldives',
  'Discover the most authentic and meaningful souvenirs to bring home from your Maldivian paradise vacation, from traditional handicrafts to local delicacies.',
  'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1/blog/maldives-souvenirs-main',
  'Hawla Riza',
  NOW(),
  'list',
  FALSE,
  ARRAY['maldives', 'travel', 'souvenirs', 'shopping', 'culture', 'handicrafts'],
  'Explore the top 10 authentic souvenirs from the Maldives, from traditional handicrafts to local delicacies. Your complete guide to Maldivian shopping.',
  ARRAY['Maldives souvenirs', 'Maldivian handicrafts', 'travel shopping', 'authentic gifts', 'traditional crafts'],
  10,
  TRUE,
  '[
    {
      "type": "text",
      "content": "<p>The Maldives offers unique treasures that capture the essence of island life and centuries of cultural heritage. Whether you''re looking for traditional crafts, delicious treats, or meaningful mementos, this guide will help you find the perfect souvenirs to remember your time in paradise.</p>"
    },
    {
      "type": "divider"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "1. Traditional Lacquerware (Laajehun)"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_800/v1/blog/lacquerware-closeup",
      "caption": "Intricate Maldivian lacquerware with traditional patterns",
      "alt": "Maldivian lacquerware bowl with traditional red, yellow, and black patterns"
    },
    {
      "type": "text",
      "content": "<p>Laajehun is perhaps the most iconic Maldivian craft. These beautiful pieces feature intricate hand-carved wooden items decorated with vibrant lacquer in traditional colors. Each piece is unique and represents centuries of artistic tradition passed down through generations.</p>"
    },
    {
      "type": "list",
      "ordered": false,
      "title": "What to look for:",
      "items": [
        "Hand-carved wooden boxes and containers",
        "Decorative bowls in various sizes",
        "Jewelry containers with intricate patterns",
        "Traditional color schemes: red, yellow, black, and green"
      ]
    },
    {
      "type": "quote",
      "text": "Each piece of laajehun tells a story of patience, skill, and cultural pride",
      "author": "Master Craftsman, Malé"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "2. Woven Palm Mats (Thundu Kunaa)"
    },
    {
      "type": "text",
      "content": "<p>These beautifully woven mats are made from local palm leaves (thundu) and showcase traditional Maldivian weaving techniques. They''re not just practical - they''re works of art that can add a tropical touch to any home.</p>"
    },
    {
      "type": "list",
      "ordered": false,
      "title": "Uses for thundu kunaa:",
      "items": [
        "Wall decorations",
        "Floor mats",
        "Beach mats",
        "Table runners"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "3. Coconut Products"
    },
    {
      "type": "gallery",
      "images": [
        {
          "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_600/v1/blog/coconut-oil-bottles",
          "caption": "Pure virgin coconut oil"
        },
        {
          "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_600/v1/blog/coconut-shell-crafts",
          "caption": "Coconut shell handicrafts"
        }
      ]
    },
    {
      "type": "text",
      "content": "<p>The coconut palm is central to Maldivian life, and you''ll find countless products made from every part of the tree.</p>"
    },
    {
      "type": "list",
      "ordered": false,
      "title": "Popular coconut products:",
      "items": [
        "Virgin coconut oil (great for cooking and skincare)",
        "Coconut shell bowls and spoons",
        "Coconut fiber (coir) products",
        "Natural coconut soaps and beauty products",
        "Coconut shell jewelry"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "4. Local Spices and Seasonings"
    },
    {
      "type": "text",
      "content": "<p>Maldivian cuisine is rich in flavors, and bringing home local spices is like bringing home the taste of paradise.</p>"
    },
    {
      "type": "list",
      "ordered": true,
      "title": "Must-buy spices:",
      "items": [
        "Rihaakuru - thick fish paste (unique to Maldives)",
        "Maldivian chili powder (bondi)",
        "Curry leaves (dried)",
        "Pandan leaves",
        "Local spice mixes"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "5. Traditional Maldivian Clothing"
    },
    {
      "type": "text",
      "content": "<p>Traditional Maldivian garments like the <em>Libaas</em> (women''s dress) or <em>Mundu</em> (sarong) make unique and practical souvenirs.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "6. Tuna Products"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_800/v1/blog/dried-tuna",
      "caption": "Traditional Maldivian dried tuna (hikimas)",
      "alt": "Smoked and dried tuna, a Maldivian specialty"
    },
    {
      "type": "text",
      "content": "<p>Tuna is the heart of Maldivian cuisine. Take home vacuum-packed dried or smoked tuna to add authentic Maldivian flavor to your cooking.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "7. Shell and Coral Crafts"
    },
    {
      "type": "text",
      "content": "<p><strong>Important:</strong> Only purchase shell crafts from sustainable sources. Never buy items made from protected species or live coral.</p><p>Look for jewelry and decorations made from ethically sourced shells - they make beautiful, ocean-inspired gifts.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "8. Maldivian Music and Books"
    },
    {
      "type": "text",
      "content": "<p>Bring home the sounds and stories of the Maldives with traditional music CDs or books about Maldivian culture, history, and poetry.</p>"
    },
    {
      "type": "list",
      "ordered": false,
      "items": [
        "Traditional bodu beru music recordings",
        "Poetry collections (like <em>Heal in Paradise</em>)",
        "Books on Maldivian history and culture",
        "Children''s books in Dhivehi"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "9. Local Art and Paintings"
    },
    {
      "type": "text",
      "content": "<p>Support local artists by purchasing paintings or prints featuring Maldivian landscapes, marine life, or cultural scenes.</p>"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "10. Miniature Dhoni (Traditional Boat)"
    },
    {
      "type": "image",
      "url": "https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_800/v1/blog/miniature-dhoni",
      "caption": "Hand-crafted miniature dhoni boat",
      "alt": "Wooden miniature of traditional Maldivian dhoni boat"
    },
    {
      "type": "text",
      "content": "<p>A miniature dhoni (traditional Maldivian boat) is a perfect symbol of island life. These hand-crafted models range from simple to incredibly detailed.</p>"
    },
    {
      "type": "divider"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Where to Buy Authentic Souvenirs"
    },
    {
      "type": "text",
      "content": "<p>For the most authentic shopping experience in Malé:</p>"
    },
    {
      "type": "list",
      "ordered": true,
      "items": [
        "<strong>Local Market</strong> - Fresh produce, spices, and local foods",
        "<strong>Chaandhanee Magu</strong> - Main shopping street with souvenir shops",
        "<strong>Majeedhee Magu</strong> - Local crafts and clothing",
        "<strong>Singapore Bazaar</strong> - Wide variety of goods",
        "<strong>STO Trade Centre</strong> - Government-run, guaranteed authentic crafts"
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Shopping Tips"
    },
    {
      "type": "list",
      "ordered": false,
      "title": "Remember:",
      "items": [
        "Bargaining is acceptable in local shops, but be respectful",
        "Check authenticity - ask about materials and origin",
        "Support local artisans when possible",
        "Avoid items made from endangered species or protected corals",
        "Keep receipts for customs purposes",
        "Pack fragile items carefully for the journey home"
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "quote",
      "text": "The best souvenirs are those that carry the spirit of the place and support the people who created them",
      "author": "Hawla Riza"
    },
    {
      "type": "text",
      "content": "<p>Whether you choose traditional crafts, local delicacies, or artistic creations, your Maldivian souvenirs will serve as beautiful reminders of your time in paradise. Each piece tells a story of island culture, craftsmanship, and the warm hospitality of the Maldivian people.</p>"
    }
  ]'::jsonb
);
