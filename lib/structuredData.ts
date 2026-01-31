/**
 * Structured Data (JSON-LD) Generator for SEO and AI Search Optimization
 *
 * This utility generates Schema.org structured data in JSON-LD format
 * to help search engines and AI bots understand and display content.
 */

export interface BookSchema {
  name: string;
  author: string;
  isbn: string;
  description: string;
  image: string;
  url: string;
  publisher?: string;
  datePublished?: string;
  inLanguage?: string;
  numberOfPages?: number;
  genre?: string[];
}

export interface PersonSchema {
  name: string;
  description: string;
  image: string;
  url: string;
  jobTitle?: string;
  nationality?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  publisher: string;
  url: string;
  keywords?: string[];
}

export interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs?: string[];
  contactPoint?: {
    contactType: string;
    email?: string;
    url?: string;
  };
}

export interface FAQSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Generate Book schema (for book page)
 */
export function generateBookSchema(data: BookSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: data.name,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    isbn: data.isbn,
    description: data.description,
    image: data.image,
    url: data.url,
    ...(data.publisher && { publisher: { '@type': 'Organization', name: data.publisher } }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.inLanguage && { inLanguage: data.inLanguage }),
    ...(data.numberOfPages && { numberOfPages: data.numberOfPages }),
    ...(data.genre && { genre: data.genre }),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: 'Contact for pricing',
      priceCurrency: 'USD',
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate Person schema (for author page)
 */
export function generatePersonSchema(data: PersonSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    ...(data.jobTitle && { jobTitle: data.jobTitle }),
    ...(data.nationality && { nationality: data.nationality }),
    ...(data.knowsAbout && { knowsAbout: data.knowsAbout }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate Article schema (for blog posts)
 */
export function generateArticleSchema(data: ArticleSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher,
      logo: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1200/v1760290035/Untitled_design_1_1_gvmxye.png',
      },
    },
    datePublished: data.datePublished,
    ...(data.dateModified && { dateModified: data.dateModified }),
    url: data.url,
    ...(data.keywords && { keywords: data.keywords }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate Organization schema (for homepage)
 */
export function generateOrganizationSchema(data: OrganizationSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
    logo: {
      '@type': 'ImageObject',
      url: data.logo,
    },
    ...(data.sameAs && { sameAs: data.sameAs }),
    ...(data.contactPoint && { contactPoint: data.contactPoint }),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(data: FAQSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(data: BreadcrumbSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate WebSite schema with search action (for homepage)
 */
export function generateWebSiteSchema(url: string, name: string): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: url,
    name: name,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate enhanced meta tags for AI search optimization
 */
export function generateEnhancedMetaTags(params: {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonicalUrl: string;
}): string {
  const tags: string[] = [];

  // Basic meta tags
  if (params.keywords && params.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${params.keywords.join(', ')}" />`);
  }

  if (params.author) {
    tags.push(`<meta name="author" content="${params.author}" />`);
  }

  // Robots directives (default: index, follow for AI crawlers)
  tags.push(`<meta name="robots" content="${params.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`);

  // Google-specific
  tags.push(`<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);

  // AI crawler specific tags
  tags.push(`<meta name="bingbot" content="index, follow" />`);
  tags.push(`<meta name="slurp" content="index, follow" />`); // Yahoo

  // Article tags
  if (params.author) {
    tags.push(`<meta name="article:author" content="${params.author}" />`);
  }

  return tags.join('\n    ');
}
