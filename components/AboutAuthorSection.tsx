import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon, ThreadsIcon, LinktreeIcon } from './icons/SocialIcons';

// Performance Optimization: Generate responsive image sources for Cloudinary
const authorImageBaseUrl = "https://res.cloudinary.com/dmtolfhsv/image/upload";
const authorImageId = "v1758977323/PXL_20250727_075925036.MP_croped_t5jbqj.jpg";

const authorImageSrcSet = [400, 600, 800]
    .map(w => `${authorImageBaseUrl}/f_auto,q_auto,w_${w}/${authorImageId} ${w}w`)
    .join(', ');

const AboutAuthorSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div 
          className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 md:p-12 lg:p-16 ring-1 ring-black ring-opacity-5"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758431623/Gemini_Generated_Image_ufm4haufm4haufm4_udkrj9.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Author Portrait */}
            <div className="md:col-span-2">
              <img 
                src={`${authorImageBaseUrl}/f_auto,q_auto,w_400/${authorImageId}`}
                srcSet={authorImageSrcSet}
                sizes="(max-width: 768px) 90vw, 40vw"
                alt="Portrait of Hawla Riza, author of the Maldivian poetry book 'Heal in Paradise'." 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/5] transform transition-transform duration-500 hover:scale-105" 
                loading="lazy"
                width="400"
                height="500"
              />
            </div>
            <div className="md:col-span-3 text-dark-slate">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate mb-4">
                Meet Hawla Riza
              </h2>
              <p className="text-xl font-semibold font-heading text-coral mb-6">
                The Voice Behind Heal in Paradise
              </p>
              <p className="mb-6 text-dark-slate/80 leading-relaxed">
                Hawla Riza is a Maldivian poet whose words breathe authentic island life and experience. Her journey of Maldivian heritage, deeply breathing its culture, and vibrant lands, scapes, and umami split and people. Hawla believes of ir heal, inspire, making grd power of her profound artistry and genuine heart.
              </p>
              <p className="text-dark-slate/80 leading-relaxed">
                This collection is her authentic voice, an essence where the island life and experience come alive through her words.
              </p>
              <div className="mt-8">
                <a href="https://linktr.ee/hawlariza" target="_blank" rel="noopener noreferrer" className="inline-block bg-coral text-white font-bold py-3 px-6 rounded-md shadow-md hover:bg-opacity-90 transition-all duration-300">
                  Follow Hawla on Social Media
                </a>
                <div className="flex space-x-4 mt-4 items-center">
                    <a href="https://instagram.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-dark-slate hover:text-coral transition-colors duration-300"><InstagramIcon /></a>
                    <a href="https://web.facebook.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-dark-slate hover:text-coral transition-colors duration-300"><FacebookIcon /></a>
                    <a href="https://x.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-dark-slate hover:text-coral transition-colors duration-300"><XIcon /></a>
                    <a href="https://tiktok.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-dark-slate hover:text-coral transition-colors duration-300"><TikTokIcon /></a>
                    <a href="https://www.threads.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-dark-slate hover:text-coral transition-colors duration-300"><ThreadsIcon /></a>
                    <a href="https://linktr.ee/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="text-dark-slate hover:text-coral transition-colors duration-300"><LinktreeIcon /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAuthorSection;