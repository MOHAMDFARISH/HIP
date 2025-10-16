import React, { useState } from 'react';

const faqData = [
    {
        question: "What is Heal in Paradise?",
        answer: "'Heal in Paradise' is a powerful collection of Maldivian poetry by author Hawla Riza. It explores themes of hope, healing, and the profound connection to island life, presented as the first-ever Maldivian literary souvenir."
    },
    {
        question: "Who is Hawla Riza?",
        answer: "Hawla Riza is a celebrated Maldivian poet whose work is deeply rooted in her heritage. Her authentic voice captures the culture, landscapes, and universal human experiences of the Maldives."
    },
    {
        question: "What makes this the first Maldivian literary souvenir?",
        answer: "Unlike typical souvenirs, 'Heal in Paradise' is a cultural and artistic keepsake. It's a beautifully crafted hardcover book with exquisite watercolor illustrations, designed to be a timeless piece of Maldivian literature that you can cherish and display."
    },
    {
        question: "When will the book be released?",
        answer: "The official release and book signing event is scheduled for October 28, 2025. Pre-orders will be shipped shortly after this date."
    },
    {
        question: "How can I pre-order Heal in Paradise?",
        answer: "You can secure your copy by visiting the 'Pre-Order' page on our website. Simply fill out your details, and you'll receive a link to complete your payment and finalize your order."
    },
    {
        question: "What is the book about?",
        answer: "The book is an intimate journey into the heart of the Maldives. Through a collection of poignant poems, it weaves tales of resilience, love, pain, and the healing power of nature and self-discovery."
    },
    {
        question: "Is this available as an ebook?",
        answer: "Currently, 'Heal in Paradise' is only available as a special collector's edition hardcover. This is to honor its status as a literary souvenir meant to be a physical keepsake."
    },
    {
        question: "Where can I get Heal in Paradise in the Maldives?",
        answer: "After the official launch on October 28, 2025, the book will be available at select local bookstores and gift shops in the Maldives. The best way to guarantee a copy is to pre-order through this website."
    }
];

const FaqItem: React.FC<{
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-coral/30">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-md"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold font-heading text-dark-slate">{question}</h3>
                <svg
                    className={`w-6 h-6 text-coral transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="px-6 pb-5 text-dark-slate/80">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    
    // JSON-LD Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className="py-16 md:py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container mx-auto px-6">
                <div
                    className="max-w-4xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-coral/20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Frequently Asked Questions</h2>
                        <p className="mt-4 text-lg text-dark-slate/70 max-w-2xl mx-auto">
                            Find answers to common questions about 'Heal in Paradise' and the pre-ordering process.
                        </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md border border-coral/20">
                        {faqData.map((faq, index) => (
                            <FaqItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;