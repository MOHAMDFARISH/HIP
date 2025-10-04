import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon, ThreadsIcon, LinktreeIcon } from './icons/SocialIcons';

const ContactSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div
          className="max-w-6xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-coral/20"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758630320/Gemini_Generated_Image_v2lp4bv2lp4bv2lp_aookgo.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">Get in Touch</h2>
            <p className="mt-4 text-lg text-dark-slate/70 max-w-2xl mx-auto">
              For media inquiries, collaborations, or to share your thoughts on the book, please reach out.
            </p>
          </div>
          <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-sand/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center border border-coral/50">
              <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">Connect on Social Media</h3>
              <p className="text-dark-slate/70 mb-6">Follow the journey and join the conversation online.</p>
              <div className="flex justify-center flex-wrap gap-6">
                <a href="https://instagram.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-dark-slate hover:text-coral transition-colors duration-300"><InstagramIcon /></a>
                <a href="https://web.facebook.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-dark-slate hover:text-coral transition-colors duration-300"><FacebookIcon /></a>
                <a href="https://x.com/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-dark-slate hover:text-coral transition-colors duration-300"><XIcon /></a>
                <a href="https://tiktok.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-dark-slate hover:text-coral transition-colors duration-300"><TikTokIcon /></a>
                <a href="https://www.threads.com/@hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-dark-slate hover:text-coral transition-colors duration-300"><ThreadsIcon /></a>
                <a href="https://linktr.ee/hawlariza" target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="text-dark-slate hover:text-coral transition-colors duration-300"><LinktreeIcon /></a>
              </div>
            </div>
            <div className="bg-sand/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center border border-coral/50">
              <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">Direct Contact</h3>
              <p className="text-dark-slate/70 mb-6">For direct inquiries, please send an email to:</p>
              <a href="mailto:info@healinparadise.com" className="text-coral font-bold text-lg hover:underline">
                info@healinparadise.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;