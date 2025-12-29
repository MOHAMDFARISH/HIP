import React from 'react';
import BlogPostSection from '../components/BlogPostSection';

interface BlogPostPageProps {
  slug: string;
  navigate: (path: string) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, navigate }) => {
  return (
    <>
      <BlogPostSection slug={slug} navigate={navigate} />
    </>
  );
};

export default BlogPostPage;
