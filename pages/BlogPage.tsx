import React from 'react';
import BlogListSection from '../components/BlogListSection';

interface BlogPageProps {
  navigate: (path: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  return (
    <>
      <BlogListSection navigate={navigate} />
    </>
  );
};

export default BlogPage;
