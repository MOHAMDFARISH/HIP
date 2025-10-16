import React from 'react';
import AboutBookSection from '../components/AboutBookSection';
import ShareButtons from '../components/ShareButtons';

const BookPage: React.FC = () => {
  return (
    <>
      <AboutBookSection />
      <div className="container mx-auto px-6 max-w-6xl -mt-12 mb-12">
        <div className="max-w-sm mx-auto">
          <ShareButtons />
        </div>
      </div>
    </>
  );
};

export default BookPage;
