import React from 'react';

interface TextBlock {
  type: 'text';
  content: string;
}

interface ImageBlock {
  type: 'image';
  url: string;
  caption?: string;
  alt?: string;
}

interface ListBlock {
  type: 'list';
  ordered: boolean;
  title?: string;
  items: string[];
}

interface GalleryBlock {
  type: 'gallery';
  images: Array<{
    url: string;
    caption?: string;
  }>;
}

interface QuoteBlock {
  type: 'quote';
  text: string;
  author?: string;
}

interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

interface DividerBlock {
  type: 'divider';
}

type ContentBlock =
  | TextBlock
  | ImageBlock
  | ListBlock
  | GalleryBlock
  | QuoteBlock
  | HeadingBlock
  | DividerBlock;

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ blocks }) => {
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <div
            key={index}
            className="prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );

      case 'image':
        return (
          <figure key={index} className="my-8">
            <img
              src={block.url}
              alt={block.alt || ''}
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
            {block.caption && (
              <figcaption className="text-center text-sm text-dark-slate/60 mt-3 italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <div key={index} className="my-6">
            {block.title && (
              <p className="font-semibold text-dark-slate mb-3">{block.title}</p>
            )}
            <ListTag className={`space-y-2 ${block.ordered ? 'list-decimal' : 'list-disc'} list-inside text-dark-slate/90`}>
              {block.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ListTag>
          </div>
        );

      case 'gallery':
        return (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {block.images.map((image, i) => (
              <figure key={i} className="group">
                <img
                  src={image.url}
                  alt={image.caption || ''}
                  className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                  loading="lazy"
                />
                {image.caption && (
                  <figcaption className="text-center text-sm text-dark-slate/60 mt-2">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="my-8 pl-6 border-l-4 border-coral py-4 bg-sand-50 rounded-r-lg pr-6"
          >
            <p className="text-xl font-heading italic text-dark-slate mb-2">
              "{block.text}"
            </p>
            {block.author && (
              <cite className="text-sm text-dark-slate/70 not-italic">
                — {block.author}
              </cite>
            )}
          </blockquote>
        );

      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        const headingSizes = {
          1: 'text-4xl md:text-5xl',
          2: 'text-3xl md:text-4xl',
          3: 'text-2xl md:text-3xl',
          4: 'text-xl md:text-2xl',
          5: 'text-lg md:text-xl',
          6: 'text-base md:text-lg',
        };
        return (
          <HeadingTag
            key={index}
            className={`font-heading font-bold text-dark-slate mt-8 mb-4 ${
              headingSizes[block.level]
            }`}
          >
            {block.text}
          </HeadingTag>
        );

      case 'divider':
        return (
          <hr key={index} className="my-8 border-t-2 border-sand-200" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default ContentBlockRenderer;
