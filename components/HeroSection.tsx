import React from 'react';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

// Performance Optimization: Generate responsive image sources for Cloudinary
const bookCoverBaseUrl = "https://res.cloudinary.com/dmtolfhsv/image/upload";
const bookCoverId = "v1758360518/Untitled_eBook_l721h0.png";

const bookCoverSrcSet = [300, 400, 600]
  .map(w => `${bookCoverBaseUrl}/f_auto,q_auto,w_${w}/${bookCoverId} ${w}w`)
  .join(', ');

const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center text-white py-20 px-4 overflow-hidden">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
          HEAL IN PARADISE
        </h1>
        <p className="mt-4 text-2xl md:text-3xl max-w-3xl font-heading italic [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          Collection of poems from the Maldives
        </p>
        <p className="mt-6 text-base md:text-lg max-w-3xl font-normal [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] leading-relaxed">
          Discover the 1st Maldivian literary souvenir.
          <br />
          A journey of hope, healing, and the serene beauty of the islands.
        </p>
        
        <div className="mt-8 relative">
          <img 
            src={`${bookCoverBaseUrl}/f_auto,q_auto,w_256/${bookCoverId}`}
            srcSet={bookCoverSrcSet}
            sizes="(max-width: 768px) 192px, 256px"
            alt="Heal in Paradise book cover - a Maldivian poetry collection by Hawla Riza" 
            className="w-48 md:w-64 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
            width="256"
            height="384"
            fetchPriority="high"
          />
          <div className="absolute top-[-17px] right-[-17px]">
             <img 
                src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_96/v1758360969/International_women_s_day_1_tghs6c.png" 
                alt="International Women's Day Recognition Badge for the book Heal in Paradise" 
                className="w-20 h-20 md:w-24 md:h-24"
                width="96"
                height="96"
                loading="lazy"
            />
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/pre-order-heal-in-paradise')}
          className="mt-8 bg-coral text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Pre-Order Your Copy Today
        </button>
      </div>
    </section>
  );
};

export default HeroSection;