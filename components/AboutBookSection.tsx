import React from 'react';

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-coral mt-1">{icon}</div>
        <p className="text-dark-slate/90">{text}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; title: string; }> = ({ quote, author, title }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg flex flex-col h-full ring-1 ring-black ring-opacity-5">
        <svg className="w-12 h-12 text-coral/30 mb-4" aria-hidden="true" fill="currentColor" viewBox="0 0 18 14"><path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 1 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/></svg>
        <p className="text-dark-slate/80 italic flex-grow">"{quote}"</p>
        <div className="mt-4 pt-4 border-t border-coral/20">
            <p className="font-heading font-semibold text-dark-slate">{author}</p>
            <p className="text-sm text-dark-slate/60">{title}</p>
        </div>
    </div>
);

const testimonials = [
    {
        quote: "Hawla Riza has crafted more than a book; she has bottled the very essence of the Maldivian soul. 'Heal in Paradise' is a landmark collection that resonates with the raw, lyrical power of the ocean itself. It is both a deeply intimate journey and a powerful cultural statement—a must-read for anyone who wishes to understand the heart of our islands.",
        author: "Ismail Shameem",
        title: "Maldivian Poet & Scholar",
    },
    {
        quote: "I saw my own stories reflected in these pages. Hawla’s words are a comforting hand, a familiar melody that speaks of home, heartbreak, and the quiet strength it takes to heal. This book is a sanctuary, a place to return to when the world feels overwhelming. It’s a piece of home I can carry with me.",
        author: "Fathimath Ishan",
        title: "Early Reader",
    },
    {
        quote: "Reading 'Heal in Paradise' is like walking through a gallery of emotions. Each poem is a masterfully painted scene, so vivid you can almost feel the sea spray and taste the salt in the air. The synergy between the profound verse and the delicate illustrations creates an experience that is both visually stunning and emotionally resonant. A true masterpiece.",
        author: "Ahmed Shujau",
        title: "Visual Artist",
    },
];

const bookSpecs = [
    { label: 'ISBN', value: '978-0-99-702549-1' },
    { label: 'Format', value: 'Hardcover' },
    { label: 'Pages', value: '61' },
    { label: 'Dimensions', value: '5.5" x 8.5"' },
    { label: 'Language', value: 'English' },
    { label: 'Publication Date', value: 'October 2025' },
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
                           {/* Book mockup image */}
                            <div className="relative">
                                <img src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_auto/v1758360518/Untitled_eBook_l721h0.png" alt="Heal in Paradise book cover" className="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105" loading="lazy" />
                                <div className="absolute top-[-5px] right-[-5px] w-24 h-24 md:w-28 md:h-28">
                                   <img src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_auto/v1758360969/International_women_s_day_1_tghs6c.png" alt="International Women's Day Recognition Badge" loading="lazy" />
                                </div>
                            </div>
                            
                            {/* Book Specifications Card */}
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
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate mb-6">Heal in Paradise: An Odyssey into the Maldivian Soul</h2>
                            <p className="text-lg mb-8 text-dark-slate/80">
                                More than a collection of poems, 'Heal in Paradise' is an intimate odyssey into the heart of the Maldives, weaving tales of resilience, hope, and the profound connection to island life.
                            </p>
                            <div className="space-y-6">
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293c.39.39.39 1.024 0 1.414L10 12l4.707 4.707c.39.39.39 1.024 0 1.414L12.414 21" /></svg>} text="An authentic Maldivian voice exploring culture, heritage, and the universal human experience." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} text="Profound themes of hope, healing, and self-discovery that resonate with readers worldwide." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>} text="Exquisite watercolor illustrations that bring the poetry to life with vibrant, tropical beauty." />
                                <FeatureItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} text="The perfect literary souvenir, capturing the timeless spirit and soul of the Maldives." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mt-16 md:mt-24 max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-dark-slate text-center mb-12">
                        Praise for Heal in Paradise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard 
                                key={index} 
                                quote={testimonial.quote} 
                                author={testimonial.author} 
                                title={testimonial.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutBookSection;