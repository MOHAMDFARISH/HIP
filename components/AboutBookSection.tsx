import React from 'react';
import ShareButtons from './ShareButtons';

// Performance Optimization: Generate responsive image sources for Cloudinary
const bookCoverBaseUrl = "https://res.cloudinary.com/dmtolfhsv/image/upload";
const bookCoverId = "v1758360518/Untitled_eBook_l721h0.png";

const bookCoverSrcSet = [300, 400, 600, 800]
  .map(w => `${bookCoverBaseUrl}/f_auto,q_auto,w_${w}/${bookCoverId} ${w}w`)
  .join(', ');

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-coral mt-1">{icon}</div>
        <p className="text-dark-slate/90">{text}</p>
    </div>
);

const bookSpecs = [
    { label: 'ISBN', value: '978-0-99-702549-1' },
    { label: 'Format', value: 'Hardcover' },
    { label: 'Pages', value: '61' },
    { label: 'Dimensions', value: '5.5" x 8.5"' },
    { label: 'Language', value: 'English' },
    { label: 'Publication Date', value: 'November 2025' },
];

const AboutBookSection: React.FC = () => {
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
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <div className="w-full max-w-sm mx-auto">
                            <div className="relative">
                                <img 
                                    src={`${bookCoverBaseUrl}/f_auto,q_auto,w_400/${bookCoverId}`}
                                    srcSet={bookCoverSrcSet}
                                    sizes="(max-width: 640px) 90vw, 384px"
                                    alt="The official book cover for 'Heal in Paradise', a collection of Maldivian poetry by Hawla Riza." 
                                    className="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105" 
                                    loading="lazy" 
                                    width="384"
                                    height="576"
                                />
                                <div className="absolute top-[-5px] right-[-5px] w-24 h-24 md:w-28 md:h-28">
                                   <img 
                                      src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_112/v1758360969/International_women_s_day_1_tghs6c.png" 
                                      alt="International Women's Day Recognition for the book Heal in Paradise, a Maldivian literary souvenir." 
                                      loading="lazy"
                                      width="112"
                                      height="112"
                                  />
                                </div>
                            </div>
                            
                            <div className="mt-8 bg-sand/50 p-6 rounded-lg border border-coral/30 shadow-inner">
                                <h3 className="font-heading text-xl font-semibold text-dark-slate mb-4 border-b border-coral/20 pb-2">
                                    Book Specifications
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {bookSpecs.map((spec) => (
                                    <li key={spec.label} className="flex justify-between items-center">
                                        <span className="font-semibold text-dark-slate/80">{spec.label}</span>
                                        <span className="text-dark-slate text-right">{spec.value}</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="text-dark-slate">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate mb-6">Heal in Paradise</h2>
                            <p className="text-lg mb-8 text-dark-slate/80">
                                'Heal in Paradise' is an intimate journey into the heart of the Maldives, weaving tales of resilience, hope, and the profound connection to island life.
                            </p>
                            <div className="space-y-6">
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293c.39.39.39 1.024 0 1.414L10 12l4.707 4.707c.39.39.39 1.024 0 1.414L12.414 21" /></svg>} text="An authentic Maldivian voice exploring culture, heritage, and the universal human experience." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} text="Profound themes of hope, healing, and self-discovery that resonate with readers worldwide." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>} text="Exquisite watercolor illustrations that bring the poetry to life with vibrant, tropical beauty." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} text="The perfect literary souvenir, capturing the timeless spirit and soul of the Maldives." />
                            </div>
                            <div className="mt-12 pt-8 border-t border-coral/20">
                                <ShareButtons />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutBookSection;